import React from 'react';
import './Awareness.css';

const Awareness: React.FC = () => {
  const campaigns = [
    {
      id: 1,
      title: '다문화 이해하기',
      description: '서로 다른 문화를 이해하고 존중하는 마음을 기르는 캠페인',
      icon: '🌍',
      color: '#2c5aa0'
    },
    {
      id: 2,
      title: '편견 없는 사회',
      description: '선입견과 편견을 없애고 열린 마음으로 소통하기',
      icon: '🤝',
      color: '#4ecdc4'
    }
  ];

  return (
    <div className="awareness-page">
      <div className="awareness-container">
        <div className="awareness-header">
          <h1>인식개선</h1>
          <p>다문화 사회에 대한 올바른 인식과 이해를 높여가는 공간입니다</p>
        </div>
        <div className="campaigns-section">
          <h2>인식개선 캠페인</h2>
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div 
                  className="campaign-icon"
                  style={{ background: campaign.color }}
                >
                  {campaign.icon}
                </div>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;