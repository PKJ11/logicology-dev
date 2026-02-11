'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import TopBar from '@/components/games/logicoland5/TopBar';
import SectionTabs from '@/components/games/logicoland5/SectionTabs';
import GridBoard from '@/components/games/logicoland5/GridBoard';
import MoveStrip from '@/components/games/logicoland5/MoveStrip';
import HintAnimator from '@/components/games/logicoland5/HintAnimator';
import FeedbackToast from '@/components/games/logicoland5/FeedbackToast';
import PrimaryButton from '@/components/games/logicoland5/PrimaryButton';
import SecondaryButton from '@/components/games/logicoland5/SecondaryButton';
import { 
  colourCrawlPuzzles, 
  arrowsAddressPuzzles,
  rightRoutePuzzles,
  knightPuzzles,
  type PuzzleColorCrawl,
  type PuzzleArrowsAddress,
  type PuzzleRightRoute,
  type PuzzleKnight,
  findPositionByNumber
} from '@/app/data/volume5';
import { GameLogic } from '@/components/games/logicoland5/GameLogic';
import { HelpCircle, RefreshCw, Check, SkipForward, Home, Target, MapPin } from 'lucide-react';
import Volume5Layout from '@/components/games/logicoland5/Volume5Layout';

type FeedbackType = 'success' | 'error' | 'hint' | 'streak' | null;
type GameMode = 'target-mode' | 'step-mode';

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const sectionId = parseInt(params.id as string);
  
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedPositions, setVisitedPositions] = useState<[number, number][]>([]);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string } | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'hint'>('playing');
  const [gameMode, setGameMode] = useState<GameMode>('target-mode');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userPath, setUserPath] = useState<[number, number][]>([]);

  // Get current puzzle based on section
  const getCurrentPuzzle = () => {
    switch (sectionId) {
      case 1:
        return colourCrawlPuzzles[currentPuzzleIndex];
      case 2:
        return arrowsAddressPuzzles[currentPuzzleIndex];
      case 3:
        return rightRoutePuzzles[0];
      case 4:
        return knightPuzzles[0];
      default:
        return colourCrawlPuzzles[0];
    }
  };

  const currentPuzzle = getCurrentPuzzle();
  const totalPuzzles = sectionId <= 2 ? (sectionId === 1 ? colourCrawlPuzzles.length : arrowsAddressPuzzles.length) : 1;

  // Get start position based on puzzle type
  const getStartPosition = (): [number, number] => {
    if (sectionId === 1) {
      const puzzle = currentPuzzle as PuzzleColorCrawl;
      return puzzle.start;
    } else if (sectionId === 2) {
      const puzzle = currentPuzzle as PuzzleArrowsAddress;
      return findPositionByNumber(puzzle.grid, puzzle.startNumber);
    } else if (sectionId === 3) {
      const puzzle = currentPuzzle as PuzzleRightRoute;
      return puzzle.start;
    } else if (sectionId === 4) {
      const puzzle = currentPuzzle as PuzzleKnight;
      return puzzle.start;
    }
    return [0, 0];
  };

  // Calculate the correct path based on moves
  const getCorrectPath = (): [number, number][] => {
    if (sectionId === 1) {
      const puzzle = currentPuzzle as PuzzleColorCrawl;
      const { path } = GameLogic.calculateColorCrawlPosition(
        puzzle.start,
        puzzle.moves,
        puzzle.grid
      );
      return path;
    } else if (sectionId === 2) {
      const puzzle = currentPuzzle as PuzzleArrowsAddress;
      const { path } = GameLogic.calculateArrowsAddressPosition(
        puzzle.startNumber,
        puzzle.moves,
        puzzle.grid
      );
      return path;
    }
    return [];
  };

  // Get the final answer position
  const getAnswerPosition = (): [number, number] => {
    if (sectionId === 1) {
      const puzzle = currentPuzzle as PuzzleColorCrawl;
      const { position } = GameLogic.calculateColorCrawlPosition(
        puzzle.start,
        puzzle.moves,
        puzzle.grid
      );
      return position;
    } else if (sectionId === 2) {
      const puzzle = currentPuzzle as PuzzleArrowsAddress;
      const { position } = GameLogic.calculateArrowsAddressPosition(
        puzzle.startNumber,
        puzzle.moves,
        puzzle.grid
      );
      return position;
    } else if (sectionId === 4) {
      const puzzle = currentPuzzle as PuzzleKnight;
      return puzzle.answer;
    }
    return [0, 0];
  };

  // Initialize game state
  useEffect(() => {
    resetGameState();
  }, [sectionId, currentPuzzleIndex, gameMode]);

  const resetGameState = () => {
    setSelectedCell(null);
    setShowHint(false);
    setCurrentStep(0);
    const startPos = getStartPosition();
    setVisitedPositions([startPos]);
    setUserPath([startPos]);
    setGameState('playing');
    setSelectedRoute(null);
    setIsAnimating(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    
    setSelectedCell([row, col]);
    
    // Check answer based on game mode
    if (gameMode === 'target-mode') {
      setTimeout(() => {
        checkFinalAnswer(row, col);
      }, 500);
    } else {
      handleStepModeClick(row, col);
    }
  };

  // Mode 1: Check if clicked cell is the final answer
  const checkFinalAnswer = (row: number, col: number) => {
    const answerPos = getAnswerPosition();
    const isCorrect = row === answerPos[0] && col === answerPos[1];

    if (isCorrect) {
      const points = 100 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback({
        type: 'success',
        message: `Correct! +${points} points`
      });
      setGameState('completed');
      
      const correctPath = getCorrectPath();
      setVisitedPositions(correctPath);
      
      if (currentPuzzleIndex < totalPuzzles - 1) {
        setTimeout(() => {
          setCurrentPuzzleIndex(prev => prev + 1);
        }, 2000);
      }
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: 'Not quite right. Try again!'
      });
    }
  };

  // Mode 2: Handle step-by-step movement
  const handleStepModeClick = (row: number, col: number) => {
    const correctPath = getCorrectPath();
    const currentStepIndex = userPath.length - 1;
    
    const lastPosition = userPath[userPath.length - 1];
    const isAdjacent = 
      Math.abs(row - lastPosition[0]) + Math.abs(col - lastPosition[1]) === 1;
    
    if (!isAdjacent) {
      setFeedback({
        type: 'error',
        message: 'You can only move to adjacent cells!'
      });
      return;
    }
    
    if (currentStepIndex < correctPath.length - 1) {
      const nextCorrectStep = correctPath[currentStepIndex + 1];
      const isCorrectStep = row === nextCorrectStep[0] && col === nextCorrectStep[1];
      
      if (isCorrectStep) {
        // Correct step - use explicit tuple casting
        const newPath: [number, number][] = [...userPath, [row, col] as [number, number]];
        setUserPath(newPath);
        setVisitedPositions(newPath);
        
        if (newPath.length === correctPath.length) {
          const points = 100 + (streak * 10);
          setScore(prev => prev + points);
          setStreak(prev => prev + 1);
          setFeedback({
            type: 'success',
            message: `Perfect! You completed the path! +${points} points`
          });
          setGameState('completed');
          
          if (currentPuzzleIndex < totalPuzzles - 1) {
            setTimeout(() => {
              setCurrentPuzzleIndex(prev => prev + 1);
            }, 2000);
          }
        } else {
          setFeedback({
            type: 'success',
            message: 'Good move! Next step...'
          });
        }
      } else {
        setStreak(0);
        setFeedback({
          type: 'error',
          message: 'Wrong move! Try again.'
        });
      }
    }
  };

  // ADD THIS FUNCTION FOR RIGHT ROUTE SECTION
  const handleRouteClick = (routeId: string) => {
    if (gameState !== 'playing' || isAnimating) return;
    
    const puzzle = currentPuzzle as PuzzleRightRoute;
    setSelectedRoute(routeId);
    const route = puzzle.routes.find(r => r.id === routeId);
    if (!route) return;
    
    setIsAnimating(true);
    const startPos = getStartPosition();
    setVisitedPositions([startPos]);
    
    let currentPos: [number, number] = [...startPos];
    const pathPositions: [number, number][] = [currentPos];
    
    route.moves.forEach((move, index) => {
      setTimeout(() => {
        let nextPos: [number, number] = [...currentPos];
        
        switch (move) {
          case '↑':
            nextPos = [currentPos[0] - 1, currentPos[1]];
            break;
          case '↓':
            nextPos = [currentPos[0] + 1, currentPos[1]];
            break;
          case '←':
            nextPos = [currentPos[0], currentPos[1] - 1];
            break;
          case '→':
            nextPos = [currentPos[0], currentPos[1] + 1];
            break;
        }
        
        if (
          nextPos[0] >= 0 && nextPos[0] < puzzle.grid.length &&
          nextPos[1] >= 0 && nextPos[1] < puzzle.grid[0].length
        ) {
          if (puzzle.grid[nextPos[0]][nextPos[1]] !== 'block') {
            currentPos = nextPos;
            pathPositions.push(currentPos);
            setVisitedPositions([...pathPositions]);
          } else {
            setIsAnimating(false);
            setFeedback({
              type: 'error',
              message: 'Route hit a blocked cell!'
            });
            return;
          }
        } else {
          setIsAnimating(false);
          setFeedback({
            type: 'error',
            message: 'Route goes out of bounds!'
          });
          return;
        }
        
        if (index === route.moves.length - 1) {
          const reachedTarget = 
            currentPos[0] === puzzle.target[0] && 
            currentPos[1] === puzzle.target[1];
          
          setTimeout(() => {
            setIsAnimating(false);
            
            if (reachedTarget && route.isCorrect) {
              const points = 100 + (streak * 10);
              setScore(prev => prev + points);
              setStreak(prev => prev + 1);
              setFeedback({
                type: 'success',
                message: `Correct route! +${points} points`
              });
              setGameState('completed');
            } else {
              setStreak(0);
              setFeedback({
                type: 'error',
                message: reachedTarget ? 
                  'This route reaches the target but is not the intended solution!' : 
                  'Route does not reach the target!'
              });
            }
          }, 500);
        }
      }, index * 300);
    });
  };

  // Get current position based on game mode
  const getCurrentPosition = (): [number, number] => {
    if (showHint && visitedPositions.length > 0) {
      return visitedPositions[visitedPositions.length - 1];
    }
    
    if (gameMode === 'step-mode' && userPath.length > 0) {
      return userPath[userPath.length - 1];
    }
    
    return getStartPosition();
  };

  // Get visited positions based on game mode
  const getDisplayedVisitedPositions = (): [number, number][] => {
    if (gameMode === 'step-mode') {
      return userPath;
    }
    return visitedPositions;
  };

  const handleHint = () => {
    setShowHint(true);
    setGameState('hint');
    setFeedback({
      type: 'hint',
      message: 'Watch the animation to see the solution!'
    });
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < totalPuzzles - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    } else {
      router.push('/logicoland/volume-5');
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    
    if (sectionId === 1) {
      const puzzle = currentPuzzle as PuzzleColorCrawl;
      const { path } = GameLogic.calculateColorCrawlPosition(
        puzzle.start,
        puzzle.moves.slice(0, step),
        puzzle.grid
      );
      setVisitedPositions(path);
    } else if (sectionId === 2) {
      const puzzle = currentPuzzle as PuzzleArrowsAddress;
      const { path } = GameLogic.calculateArrowsAddressPosition(
        puzzle.startNumber,
        puzzle.moves.slice(0, step),
        puzzle.grid
      );
      setVisitedPositions(path);
    }
  };

  const getSectionName = () => {
    switch (sectionId) {
      case 1: return 'Colour Crawl';
      case 2: return 'Arrows Address';
      case 3: return 'Right Route';
      case 4: return 'Knowing Knight';
      default: return 'Unknown';
    }
  };

  const getGridType = () => {
    return sectionId === 2 ? 'number' : 'color';
  };

  const getTargetPosition = (): [number, number] | undefined => {
    if (sectionId === 3) {
      const puzzle = currentPuzzle as PuzzleRightRoute;
      return puzzle.target;
    } else if (sectionId === 4) {
      const puzzle = currentPuzzle as PuzzleKnight;
      return puzzle.target;
    }
    return undefined;
  };

  // Render game mode selector for sections 1 and 2
  const renderGameModeSelector = () => {
    if (sectionId !== 1 && sectionId !== 2) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-4 shadow-soft">
          <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Game Mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameMode('target-mode')}
              className={`
                rounded-xl p-4 text-center transition-all flex flex-col items-center gap-2
                ${gameMode === 'target-mode'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-orange-50'
                }
              `}
            >
              <Target className="w-6 h-6" />
              <span className="font-bold">Target Mode</span>
              <span className="text-sm">Click the final position</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameMode('step-mode')}
              className={`
                rounded-xl p-4 text-center transition-all flex flex-col items-center gap-2
                ${gameMode === 'step-mode'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white text-gray-800 hover:bg-green-50'
                }
              `}
            >
              <MapPin className="w-6 h-6" />
              <span className="font-bold">Step Mode</span>
              <span className="text-sm">Click each step of the path</span>
            </motion.button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            {gameMode === 'target-mode' 
              ? "Tap the cell where you'll land after following all the moves."
              : "Tap each cell in the correct sequence to reach the destination."
            }
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPuzzleContent = () => {
    if (sectionId === 3) {
      const puzzle = currentPuzzle as PuzzleRightRoute;
      const isCorrectRoute = (routeId: string) => routeId === puzzle.answer;
      
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-6">
            Select the correct route from Start (S) to Target (⭐)
          </div>
          
          <div className="mb-8">
            <GridBoard
              type="color"
              grid={puzzle.grid as any}
              currentPosition={getCurrentPosition()}
              visitedPositions={visitedPositions}
              onCellClick={() => {}}
              isInteractive={false}
              showStart={true}
              startPosition={puzzle.start}
              targetPosition={puzzle.target}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {puzzle.routes.map(route => {
              const isSelected = selectedRoute === route.id;
              const correct = isCorrectRoute(route.id);
              
              return (
                <div
                  key={route.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                    isSelected 
                      ? correct
                        ? 'ring-4 ring-green-500' 
                        : 'ring-4 ring-red-500'
                      : 'hover:shadow-xl cursor-pointer'
                  } ${isAnimating ? 'pointer-events-none' : ''}`}
                  onClick={() => !isAnimating && handleRouteClick(route.id)}
                >
                  <h4 className="text-xl font-bold mb-4">{route.name}</h4>
                  
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {route.moves.map((move, idx) => (
                      <div 
                        key={idx} 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected && idx < visitedPositions.length - 1
                            ? correct
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <span className="text-xl">{move}</span>
                      </div>
                    ))}
                  </div>
                  
                  {isSelected && isAnimating && (
                    <div className="text-blue-600 font-medium mb-4 animate-pulse">
                      Animating path...
                    </div>
                  )}
                  
                  {isSelected && !isAnimating && (
                    <div className={`font-bold mb-4 ${
                      correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {correct ? '✓ Correct Route!' : '✗ Wrong Route'}
                    </div>
                  )}
                  
                  <PrimaryButton 
                    fullWidth 
                    disabled={isAnimating}
                    onClick={() => !isAnimating && handleRouteClick(route.id)}
                    variant={isSelected ? (correct ? 'success' : 'warning') : 'primary'}
                  >
                    {isAnimating ? 'Animating...' : 
                     isSelected ? (correct ? 'Correct!' : 'Incorrect') : 
                     'Test Route'}
                  </PrimaryButton>
                </div>
              );
            })}
          </div>
          
          {isAnimating && selectedRoute && (
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div 
                  className="bg-blue-600 h-4 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${(visitedPositions.length / (puzzle.routes.find(r => r.id === selectedRoute)?.moves.length || 1)) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-2 text-gray-600">
                Following path: {visitedPositions.length - 1} of {
                  puzzle.routes.find(r => r.id === selectedRoute)?.moves.length || 0
                } moves
              </p>
            </div>
          )}
        </div>
      );
    }

    if (sectionId === 4) {
      const puzzle = currentPuzzle as PuzzleKnight;
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-6">
            Tap the square where the knight can move next
          </div>
          <p className="text-gray-600 mb-6">
            Remember: Knights move in an L-shape (2 squares in one direction, then 1 square perpendicular)
          </p>
          
          <div className="mb-8">
            <GridBoard
              type="color"
              grid={puzzle.grid as any}
              currentPosition={getCurrentPosition()}
              visitedPositions={visitedPositions}
              onCellClick={handleCellClick}
              isInteractive={gameState === 'playing'}
              showStart={true}
              startPosition={puzzle.start}
              targetPosition={puzzle.target}
              size="lg"
            />
          </div>
        </div>
      );
    }

    return (
      <>
        {renderGameModeSelector()}

        <div className="mb-8">
          <GridBoard
            type={getGridType()}
            grid={currentPuzzle.grid as any}
            currentPosition={getCurrentPosition()}
            visitedPositions={getDisplayedVisitedPositions()}
            onCellClick={handleCellClick}
            isInteractive={gameState === 'playing'}
            showStart={true}
            startPosition={getStartPosition()}
            targetPosition={getTargetPosition()}
            size="lg"
          />
        </div>

        <div className="mb-8">
          <MoveStrip
            moves={sectionId === 1 ? 
              (currentPuzzle as PuzzleColorCrawl).moves : 
              (currentPuzzle as PuzzleArrowsAddress).moves
            }
            currentMoveIndex={gameMode === 'step-mode' ? userPath.length - 1 : currentStep}
            type={sectionId === 1 ? 'color' : 'arrow'}
          />
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {gameMode === 'target-mode' 
              ? sectionId === 1 
                ? 'Which color cell will you land on?' 
                : 'Which block number do you reach?'
              : sectionId === 1
                ? 'Follow the color code path step by step'
                : 'Follow the arrow path step by step'
            }
          </h3>
          <div className="text-center text-lg text-gray-600">
            {gameMode === 'target-mode'
              ? 'Tap on the grid to select your answer'
              : 'Tap each cell in the correct sequence to reach the destination'
            }
          </div>
          
          {gameMode === 'step-mode' && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                Step {userPath.length} of {getCorrectPath().length}
              </div>
              <p className="text-gray-600 mt-2">
                {userPath.length === getCorrectPath().length
                  ? 'Complete! 🎉'
                  : 'Find the next cell in the sequence'
                }
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  const getDifficulty = () => {
    const puzzle = currentPuzzle as any;
    return puzzle.difficulty || 'medium';
  };

  return (
    <Volume5Layout
      sectionNumber={sectionId}
      sectionName={getSectionName()}
    >
      <TopBar
        onBack={() => router.push('/logicoland/volume-5')}
        title={`Section ${sectionId}: ${getSectionName()}`}
        score={score}
        progress={currentPuzzleIndex + 1}
        totalPuzzles={totalPuzzles}
        streak={streak}
        sectionNumber={sectionId}
      />

      <SectionTabs currentSection={sectionId} />

      <div className="mb-8">
        {renderPuzzleContent()}
      </div>

      {showHint && (
        <div className="mb-8">
          <HintAnimator
            moves={sectionId === 1 ? 
              (currentPuzzle as PuzzleColorCrawl).moves : 
              (sectionId === 2 ? (currentPuzzle as PuzzleArrowsAddress).moves : [])
            }
            type="sequence"
            onStepChange={handleStepChange}
            autoPlay={true}
            speed="normal"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {gameState === 'playing' ? (
          <>
            <SecondaryButton
              icon={HelpCircle}
              onClick={handleHint}
              size="lg"
            >
              Show Hint
            </SecondaryButton>
            
            <SecondaryButton
              icon={RefreshCw}
              onClick={resetGameState}
              size="lg"
            >
              Reset
            </SecondaryButton>
            
            <SecondaryButton
              icon={SkipForward}
              onClick={handleNextPuzzle}
              size="lg"
              variant="soft"
            >
              Skip Puzzle
            </SecondaryButton>
          </>
        ) : gameState === 'completed' ? (
          <PrimaryButton
            icon={Check}
            onClick={handleNextPuzzle}
            size="lg"
          >
            {currentPuzzleIndex < totalPuzzles - 1 ? 'Next Puzzle' : 'Finish Section'}
          </PrimaryButton>
        ) : null}
        
        <SecondaryButton
          icon={Home}
          onClick={() => router.push('/logicoland/volume-5')}
          size="lg"
          variant="ghost"
        >
          Back to Menu
        </SecondaryButton>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-gray-800">Puzzle {currentPuzzleIndex + 1} of {totalPuzzles}</h4>
            <p className="text-gray-600">{(currentPuzzle as any).title}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-500">Mode:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                gameMode === 'target-mode' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {gameMode === 'target-mode' ? 'Target Mode' : 'Step Mode'}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-bold">
              Difficulty: {getDifficulty()}
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold">
              Points: {100 + (streak * 10)}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <FeedbackToast
          type={feedback.type!}
          message={feedback.message}
          streak={streak}
          score={feedback.type === 'success' ? 100 + (streak * 10) : 0}
          onClose={() => setFeedback(null)}
        />
      )}
    </Volume5Layout>
  );
}