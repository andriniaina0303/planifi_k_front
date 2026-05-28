import React from 'react';
import { Spin, Progress } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  /** Message à afficher pendant le chargement */
  message?: string;
  /** Afficher le pourcentage de progression */
  progress?: number;
  /** Taille du spinner*/
  size?: 'small' | 'medium' | 'large';
  /** Afficher en plein écran avec overlay */
  fullScreen?: boolean;
  /** Classe CSS personnalisée */
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Chargement en cours...",
  progress,
  size = 'medium',
  fullScreen = false,
  className = ""
}) => {
  
  // Mapping tailles Ant Design
  const spinSizes = {
    small: 24,
    medium: 40,
    large: 64
  };

  const textSizes = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem'
  };

  const LoadingContent = () => (
    <div className={`d-flex flex-column align-items-center justify-content-center gap-3 ${className}`} style={{ minHeight: '200px' }}>
      {/* Spinner rotatif avec Ant Design */}
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: spinSizes[size], color: '#FAC900' }} spin />}
      />

      {/* Message de chargement */}
      <div className="text-center">
        <p className="fw-semibold text-gray-700 mb-2" style={{ fontSize: textSizes[size] }}>
          {message}
        </p>

        {/* Barre de progression (si fournie) */}
        {progress !== undefined && (
          <div style={{ width: '300px' }} className="mx-auto">
            <Progress
              percent={Math.min(100, Math.max(0, Math.round(progress)))}
              strokeColor={{ '0%': '#FAC900', '100%': '#FFEA2C' }}
              format={(percent) => `${percent}%`}
            />
          </div>
        )}

        {/* Points d'animation */}
        <div className="d-flex gap-1 justify-content-center mt-3">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#FAC900',
                borderRadius: '50%',
                animation: `bounce 1.4s infinite`,
                animationDelay: `${delay}ms`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  // Mode plein écran avec overlay
  if (fullScreen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className="bg-white rounded-4 p-5 shadow-lg" style={{ maxWidth: '400px' }}>
          <LoadingContent />
        </div>
      </div>
    );
  }

  // Mode inline
  return <LoadingContent />;
};

export default Loading;
