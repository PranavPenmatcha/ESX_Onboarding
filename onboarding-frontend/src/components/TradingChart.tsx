import React from 'react';

const TradingChart: React.FC = () => {
  // Chart bar data with heights and colors from the original design
  const chartBars = [
    { height: 60.6, color: '#561f1f' },
    { height: 46.5, color: '#561f1f' },
    { height: 76.8, color: '#23561f' },
    { height: 53.2, color: '#23561f' },
    { height: 76.8, color: '#561f1f' },
    { height: 34.6, color: '#561f1f' },
    { height: 55.8, color: '#23561f' },
    { height: 39.8, color: '#561f1f' },
    { height: 64.3, color: '#561f1f' },
    { height: 45.1, color: '#561f1f' },
    { height: 20.6, color: '#561f1f' },
    { height: 59.3, color: '#561f1f' },
    { height: 41.9, color: '#561f1f' },
    { height: 10.3, color: '#23561f' },
    { height: 59.3, color: '#23561f' },
    { height: 19.5, color: '#23561f' },
    { height: 49.1, color: '#23561f' },
    { height: 28.4, color: '#23561f' },
    { height: 60.2, color: '#561f1f' },
    { height: 16.2, color: '#561f1f' },
    { height: 70.1, color: '#23561f' },
    { height: 7.4, color: '#561f1f' },
    { height: 69.6, color: '#23561f' },
    { height: 16.2, color: '#561f1f' },
    { height: 73.1, color: '#23561f' },
    { height: 6.9, color: '#23561f' },
    { height: 47.0, color: '#561f1f' },
    { height: 6.7, color: '#561f1f' },
    { height: 65.4, color: '#23561f' },
    { height: 9.7, color: '#23561f' },
    { height: 47.8, color: '#561f1f' },
    { height: 12.7, color: '#23561f' },
    { height: 36.4, color: '#561f1f' },
    { height: 15.7, color: '#561f1f' },
    { height: 31.4, color: '#561f1f' },
    { height: 13.4, color: '#23561f' },
    { height: 34.8, color: '#561f1f' },
    { height: 25.5, color: '#23561f' },
    { height: 37.8, color: '#561f1f' },
    { height: 32.3, color: '#23561f' },
    { height: 44.8, color: '#561f1f' },
    { height: 20.0, color: '#23561f' },
    { height: 11.7, color: '#23561f' },
    { height: 4.9, color: '#561f1f' },
    { height: 55.8, color: '#561f1f' },
    { height: 29.5, color: '#23561f' },
    { height: 21.5, color: '#561f1f' },
    { height: 13.4, color: '#23561f' },
    { height: 29.5, color: '#561f1f' },
    { height: 54.3, color: '#561f1f' },
    { height: 61.1, color: '#23561f' },
    { height: 26.0, color: '#23561f' },
    { height: 16.4, color: '#23561f' },
    { height: 47.5, color: '#561f1f' },
    { height: 23.2, color: '#23561f' },
    { height: 15.3, color: '#561f1f' },
    { height: 55.8, color: '#561f1f' },
    { height: 28.6, color: '#561f1f' },
    { height: 21.1, color: '#23561f' },
    { height: 52.1, color: '#23561f' },
    { height: 41.7, color: '#23561f' },
    { height: 61.9, color: '#561f1f' },
    { height: 24.0, color: '#561f1f' },
    { height: 16.5, color: '#561f1f' },
    { height: 42.3, color: '#23561f' },
    { height: 14.9, color: '#23561f' },
    { height: 34.6, color: '#23561f' },
    { height: 58.3, color: '#23561f' },
    { height: 43.2, color: '#561f1f' },
    { height: 30.5, color: '#561f1f' },
    { height: 21.1, color: '#561f1f' },
    { height: 62.7, color: '#23561f' },
    { height: 41.1, color: '#23561f' },
    { height: 51.1, color: '#561f1f' },
    { height: 58.8, color: '#23561f' },
    { height: 40.4, color: '#23561f' },
    { height: 31.5, color: '#23561f' },
    { height: 23.6, color: '#561f1f' },
    { height: 18.2, color: '#561f1f' },
    { height: 14.2, color: '#561f1f' },
    { height: 18.8, color: '#23561f' },
    { height: 24.2, color: '#23561f' },
    { height: 36.7, color: '#561f1f' },
    { height: 41.5, color: '#561f1f' },
    { height: 47.3, color: '#561f1f' },
    { height: 40.2, color: '#561f1f' },
    { height: 31.1, color: '#23561f' },
    { height: 22.6, color: '#23561f' },
    { height: 19.0, color: '#561f1f' },
    { height: 10.5, color: '#23561f' },
    { height: 5.3, color: '#23561f' }
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#202020',
      borderRadius: '12px',
      padding: '20px'
    }}>
      {/* Grid lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Horizontal grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
          <line
            key={`h-${line}`}
            x1="60"
            y1={`${60 + (line * 200) / 8}px`}
            x2="calc(100% - 60px)"
            y2={`${60 + (line * 200) / 8}px`}
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.3"
          />
        ))}

        {/* Vertical grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((line) => (
          <line
            key={`v-${line}`}
            x1={`${60 + (line * (100 - 120)) / 10}%`}
            y1="60"
            x2={`${60 + (line * (100 - 120)) / 10}%`}
            y2="260"
            stroke="#333"
            strokeWidth="1"
            strokeDasharray="5,5"
            opacity="0.2"
          />
        ))}
      </svg>

      {/* Y-axis labels */}
      <div style={{ position: 'absolute', right: '20px', top: '20px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>80%</div>
      <div style={{ position: 'absolute', right: '20px', top: '50px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>70%</div>
      <div style={{ position: 'absolute', right: '20px', top: '80px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>60%</div>
      <div style={{ position: 'absolute', right: '20px', top: '110px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>50%</div>
      <div style={{ position: 'absolute', right: '20px', top: '140px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>40%</div>
      <div style={{ position: 'absolute', right: '20px', top: '170px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>30%</div>
      <div style={{ position: 'absolute', right: '20px', top: '200px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>20%</div>
      <div style={{ position: 'absolute', right: '20px', top: '230px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>10%</div>
      <div style={{ position: 'absolute', right: '20px', top: '260px', color: '#CACACA', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>0%</div>
      
      {/* Chart bars container */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '60px',
        right: '60px',
        height: '200px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '3px',
        overflow: 'hidden'
      }}>
        {chartBars.map((bar, index) => (
          <div
            key={index}
            style={{
              width: '16px',
              height: `${Math.min(bar.height * 2.2, 180)}px`,
              backgroundColor: bar.color,
              flex: '0 0 auto',
              opacity: 0.9,
              borderRadius: '1px'
            }}
          />
        ))}
      </div>

      {/* Volume indicator */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '20px',
        padding: '8px 12px',
        backgroundColor: '#2E281F',
        borderRadius: '8px',
        border: '1px solid #F3CA9A',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: 'white', fontSize: '14px', fontFamily: 'Inter', fontWeight: '500' }}>Volume</span>
        <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '2px' }}></div>
      </div>

      {/* Progress line and indicator */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '0',
        right: '60px',
        height: '1px',
        borderTop: '2px dashed #F3CA9A',
        transform: 'translateY(-50%)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        backgroundColor: '#F3CA9A',
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '14px',
        fontFamily: 'Inter',
        fontWeight: '600'
      }}>
        47.5%
      </div>

      {/* Time labels */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '60px',
        right: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#CACACA',
        fontFamily: 'Inter'
      }}>
        <span>02:30 PM</span>
        <span>03:00 PM</span>
        <span>03:30 PM</span>
        <span>04:00 PM</span>
        <span>04:30 PM</span>
        <span>05:00 PM</span>
        <span>05:30 PM</span>
        <span>06:00 PM</span>
      </div>
    </div>
  );
};

export default TradingChart;
