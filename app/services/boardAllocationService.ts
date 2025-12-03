import dbConnect from '@/lib/dbConnect';
import BoardAllocation from '../models/BoardAllocation';
import User from '../models/User';
import mongoose from 'mongoose';

interface TimeSlot {
  day: 'saturday' | 'sunday';
  timeSlot: string;
  startTime: string;
  endTime: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { day: 'saturday', timeSlot: '11:30-13:30', startTime: '11:30', endTime: '13:30' },
  { day: 'sunday', timeSlot: '14:30-16:30', startTime: '14:30', endTime: '16:30' }
];

const MAX_USERS_PER_BOARD = 6;
const TOTAL_BOARDS = 6;

// Export interfaces
export interface BoardStats {
  boardNumber: number;
  currentUsers: number;
  maxUsers: number;
  users: string[];
  availableSlots: number;
}

export interface AllocationResult {
  boardNumber: number;
  day: string;
  timeSlot: string;
  slotTime: Date;
  previousBoard?: number;
  moved: boolean;
}

// Main allocation function
export async function allocateBoard(userId: string, day: 'saturday' | 'sunday'): Promise<{
  boardNumber: number;
  day: string;
  timeSlot: string;
  slotTime: Date;
}> {
  await dbConnect();

  const timeSlot = day === 'saturday' ? '11:30-13:30' : '14:30-16:30';
  const userObjectId = new mongoose.Types.ObjectId(userId);

  console.log(`Allocating user ${userId} to ${day} ${timeSlot}`);

  // Get all boards for the selected day and time slot
  const boards = await BoardAllocation.find({ day, timeSlot }).sort({ boardNumber: 1 });

  // If no boards exist, create all 6 boards
  if (boards.length === 0) {
    for (let i = 1; i <= TOTAL_BOARDS; i++) {
      const newBoard = new BoardAllocation({
        boardNumber: i,
        day,
        timeSlot,
        currentUsers: 0,
        maxUsers: MAX_USERS_PER_BOARD,
        users: []
      });
      await newBoard.save();
    }
  }

  // Refresh boards after creation
  const allBoards = await BoardAllocation.find({ day, timeSlot }).sort({ currentUsers: 1, boardNumber: 1 });

  // Find board with minimum users that has capacity
  let selectedBoard = null;
  
  for (const board of allBoards) {
    if (board.currentUsers < MAX_USERS_PER_BOARD) {
      selectedBoard = board;
      break;
    }
  }

  if (!selectedBoard) {
    throw new Error('All boards are full for this time slot');
  }

  // Add user to board
  selectedBoard.currentUsers += 1;
  selectedBoard.users.push(userObjectId);
  selectedBoard.lastUpdated = new Date();
  await selectedBoard.save();

  // Calculate slot time
  const slotTime = calculateSlotTime(day, timeSlot);

  return {
    boardNumber: selectedBoard.boardNumber,
    day,
    timeSlot,
    slotTime
  };
}

function calculateSlotTime(day: string, timeSlot: string): Date {
  const now = new Date();
  const targetDay = day === 'saturday' ? 6 : 0; // 6 = Saturday, 0 = Sunday
  
  // Find next occurrence of the target day
  const daysUntilTarget = (targetDay + 7 - now.getDay()) % 7 || 7;
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + daysUntilTarget);
  
  // Set the time based on time slot
  let hours, minutes;
  if (timeSlot === '11:30-13:30') {
    hours = 11;
    minutes = 30;
  } else {
    hours = 14;
    minutes = 30;
  }
  
  nextDay.setHours(hours, minutes, 0, 0);
  
  return nextDay;
}

// Get board statistics
export async function getBoardStats(day?: 'saturday' | 'sunday'): Promise<BoardStats[]> {
  await dbConnect();
  
  const query = day ? { day } : {};
  const boards = await BoardAllocation.find(query);
  
  const stats = await BoardAllocation.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$day',
        boards: {
          $push: {
            boardNumber: '$boardNumber',
            currentUsers: '$currentUsers',
            maxUsers: '$maxUsers',
            timeSlot: '$timeSlot',
            users: '$users',
            availableSlots: { $subtract: [6, '$currentUsers'] }
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        totalUsers: { $sum: '$boards.currentUsers' },
        totalCapacity: { $multiply: [{ $size: '$boards' }, 6] },
        availableSlots: { $subtract: [{ $multiply: [{ $size: '$boards' }, 6] }, { $sum: '$boards.currentUsers' }] },
        boards: 1
      }
    }
  ]);

  // Flatten the results for easier consumption
  const flattenedStats: BoardStats[] = [];
  stats.forEach(dayStat => {
    dayStat.boards.forEach((board: any) => {
      flattenedStats.push({
        boardNumber: board.boardNumber,
        currentUsers: board.currentUsers,
        maxUsers: board.maxUsers,
        users: board.users.map((id: mongoose.Types.ObjectId) => id.toString()),
        availableSlots: board.availableSlots
      });
    });
  });

  return flattenedStats;
}

// Get available slots
export async function getAvailableSlots(day: 'saturday' | 'sunday') {
  await dbConnect();
  
  const boards = await BoardAllocation.find({ day });
  
  // Calculate total available slots
  const totalSlots = TOTAL_BOARDS * MAX_USERS_PER_BOARD;
  const usedSlots = boards.reduce((sum, board) => sum + board.currentUsers, 0);
  const availableSlots = totalSlots - usedSlots;
  
  return {
    day,
    totalSlots,
    usedSlots,
    availableSlots,
    isFull: availableSlots <= 0,
    boardDetails: boards.map(board => ({
      boardNumber: board.boardNumber,
      currentUsers: board.currentUsers,
      maxUsers: board.maxUsers,
      available: board.currentUsers < board.maxUsers,
      users: board.users
    }))
  };
}

// Rebalance boards function
export async function rebalanceBoards(day: 'saturday' | 'sunday', timeSlot: string): Promise<void> {
  await dbConnect();

  console.log(`Rebalancing boards for ${day} ${timeSlot}`);

  // Get all boards for the specified day and time slot
  const boards = await BoardAllocation.find({ day, timeSlot }).sort({ boardNumber: 1 });
  
  if (boards.length === 0) {
    console.log('No boards found to rebalance');
    return;
  }

  // Collect all users from all boards
  const allUsers: mongoose.Types.ObjectId[] = [];
  boards.forEach(board => {
    allUsers.push(...board.users);
  });

  const totalUsers = allUsers.length;
  console.log(`Total users to redistribute: ${totalUsers}`);

  // Clear all boards
  for (const board of boards) {
    board.users = [];
    board.currentUsers = 0;
    await board.save();
  }

  // Redistribute users evenly
  const usersPerBoard = Math.floor(totalUsers / boards.length);
  const remainder = totalUsers % boards.length;

  console.log(`Users per board: ${usersPerBoard}, Remainder: ${remainder}`);

  let userIndex = 0;
  for (let i = 0; i < boards.length; i++) {
    const board = boards[i];
    const usersForThisBoard = usersPerBoard + (i < remainder ? 1 : 0);
    
    if (usersForThisBoard > 0) {
      board.users = allUsers.slice(userIndex, userIndex + usersForThisBoard);
      board.currentUsers = board.users.length;
      userIndex += usersForThisBoard;
      
      await board.save();
      
      // Update each user's competition slot
      for (const userId of board.users) {
        await User.findByIdAndUpdate(userId, {
          $set: {
            'competitionSlot.boardNumber': board.boardNumber
          }
        });
      }
    }
  }

  console.log(`Rebalancing complete. Redistributed ${totalUsers} users across ${boards.length} boards`);
}

// Move user between boards
export async function moveUserBetweenBoards(
  userId: string,
  fromBoardNumber: number,
  toBoardNumber: number,
  day: 'saturday' | 'sunday',
  timeSlot: string
): Promise<boolean> {
  await dbConnect();

  console.log(`Moving user ${userId} from board ${fromBoardNumber} to board ${toBoardNumber}`);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Find source board
  const sourceBoard = await BoardAllocation.findOne({
    day,
    timeSlot,
    boardNumber: fromBoardNumber
  });

  if (!sourceBoard) {
    console.log(`Source board ${fromBoardNumber} not found`);
    return false;
  }

  // Check if user is on source board
  const userIndex = sourceBoard.users.findIndex((id: mongoose.Types.ObjectId) => 
    id.equals(userObjectId)
  );

  if (userIndex === -1) {
    console.log(`User ${userId} not found on board ${fromBoardNumber}`);
    return false;
  }

  // Find destination board
  const destBoard = await BoardAllocation.findOne({
    day,
    timeSlot,
    boardNumber: toBoardNumber
  });

  if (!destBoard) {
    console.log(`Destination board ${toBoardNumber} not found`);
    return false;
  }

  // Check destination board capacity
  if (destBoard.users.length >= MAX_USERS_PER_BOARD) {
    console.log(`Destination board ${toBoardNumber} is full`);
    return false;
  }

  // Remove user from source board
  sourceBoard.users.splice(userIndex, 1);
  sourceBoard.currentUsers = sourceBoard.users.length;
  await sourceBoard.save();

  // Add user to destination board
  destBoard.users.push(userObjectId);
  destBoard.currentUsers = destBoard.users.length;
  await destBoard.save();

  // Update user's competition slot
  await User.findByIdAndUpdate(userId, {
    $set: {
      'competitionSlot.boardNumber': toBoardNumber
    }
  });

  console.log(`Successfully moved user ${userId} from board ${fromBoardNumber} to board ${toBoardNumber}`);
  return true;
}

// Get user's board information
export async function getUserBoard(userId: string): Promise<{
  boardNumber: number;
  day: string;
  timeSlot: string;
  usersOnBoard: string[];
} | null> {
  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  const board = await BoardAllocation.findOne({
    users: userObjectId
  });

  if (!board) return null;

  return {
    boardNumber: board.boardNumber,
    day: board.day,
    timeSlot: board.timeSlot,
    usersOnBoard: board.users.map((id: mongoose.Types.ObjectId) => id.toString())
  };
}

// Get all users on a specific board
export async function getUsersOnBoard(boardNumber: number, day: 'saturday' | 'sunday', timeSlot: string) {
  await dbConnect();

  const board = await BoardAllocation.findOne({
    boardNumber,
    day,
    timeSlot
  });

  if (!board) {
    return [];
  }

  // Get user details for each user on the board
  const users = await User.find({
    _id: { $in: board.users }
  }).select('name email phone userType schoolDetails');

  return users;
}

// Check if a board exists, create if not
export async function ensureBoardsExist(day: 'saturday' | 'sunday', timeSlot: string) {
  await dbConnect();

  const existingBoards = await BoardAllocation.countDocuments({ day, timeSlot });
  
  if (existingBoards === 0) {
    console.log(`Creating boards for ${day} ${timeSlot}`);
    const boardPromises = [];
    
    for (let i = 1; i <= TOTAL_BOARDS; i++) {
      const board = new BoardAllocation({
        boardNumber: i,
        day,
        timeSlot,
        currentUsers: 0,
        maxUsers: MAX_USERS_PER_BOARD,
        users: []
      });
      boardPromises.push(board.save());
    }
    
    await Promise.all(boardPromises);
    console.log(`Created ${TOTAL_BOARDS} boards for ${day} ${timeSlot}`);
  }

  return true;
}