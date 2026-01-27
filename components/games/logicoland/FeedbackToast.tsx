import { Feedback } from './types';

interface FeedbackToastProps {
  feedback: Feedback;
  onClose: () => void;
}

export default function FeedbackToast({ feedback, onClose }: FeedbackToastProps) {
  const getIcon = () => {
    switch (feedback.type) {
      case 'success': return '🎉';
      case 'error': return '😅';
      case 'warning': return '⚠️';
      case 'info': return '💡';
      default: return '💡';
    }
  };

  const getBgColor = () => {
    switch (feedback.type) {
      case 'success': return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300';
      case 'error': return 'bg-gradient-to-r from-red-100 to-pink-100 border-red-300';
      case 'warning': return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300';
      case 'info': return 'bg-gradient-to-r from-blue-100 to-sky-100 border-blue-300';
      default: return 'bg-gradient-to-r from-blue-100 to-sky-100 border-blue-300';
    }
  };

  const getTextColor = () => {
    switch (feedback.type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${getBgColor()} border-2 rounded-2xl p-4 shadow-lg flex items-center gap-3`}>
        <span className="text-2xl">{getIcon()}</span>
        <span className={`font-bold ${getTextColor()}`}>{feedback.message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Close feedback"
        >
          ✕
        </button>
      </div>
    </div>
  );
}