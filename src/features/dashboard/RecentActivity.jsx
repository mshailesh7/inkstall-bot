import React from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';

const recentActivities = [
  {
    title: "Physics Paper 1 - Mechanics",
    status: "Corrected",
    date: "27 March 2025",
    color: "#15B46F",
    id: "physics-1",
  },
  {
    title: "Chemistry Paper 2 - Organic",
    status: "Corrected",
    date: "12 March 2025",
    color: "#15B46F",
    id: "chemistry-2",
  },
  {
    title: "Biology Paper 3 - Ecology",
    status: "Generated",
    date: "15 March 2025",
    color: "#FFA800",
    id: "biology-3",
  },
  {
    title: "Mathematics Paper 2 - Trigonometry",
    status: "Generated",
    date: "18 March 2025",
    color: "#FFA800",
    id: "maths-2",
  },
];

const RecentActivity = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      // background: "linear-gradient(135deg, #d7e8fa 0%, #b3d0f7 100%)",
      minHeight: "100vh",
      // padding: "24px"
    }}>
      {/* <h3 style={{ marginBottom: "16px", color: "#222" }}>Recent Activity</h3> */}
      <div style={{
        background: "rgba(255,255,255,0.6)",
        borderRadius: "18px",
        boxShadow: "0 2px 16px #b3d0f7",
        padding: "21px",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "18px" }}>
          <span style={{
            background: "#e6f0fa",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px"
          }}>
            <span role="img" aria-label="clock" style={{ fontSize: "18px" }}>🕒</span>
          </span>
          <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>
            Recent Papers & Corrections
          </span>
        </div>
        {recentActivities.map((item, idx) => (
          <div key={item.title}
            style={{
              background: "#fff",
              borderRadius: "14px",
              marginBottom: idx === recentActivities.length - 1 ? 0 : "12px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #e6f0fa",
              boxShadow: "0 1px 4px #e6f0fa"
            }}>
            <div>
              <div style={{ fontWeight: "500", fontSize: "1.08em" }}>{item.title}</div>
              <div style={{ fontSize: "0.97em", marginTop: "2px" }}>
                <span style={{ color: item.color, fontWeight: "500" }}>
                  {item.status}
                </span>
                <span style={{ color: "#888", marginLeft: "4px" }}>
                  on {item.date}
                </span>
              </div>
            </div>
            <button 
              style={{
                background: "#b3d0f7",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px"
              }}
              onClick={() => {
                // Navigate to the specific paper details
                navigate(`/papers/${item.id}`);
              }}
            >
              <ChevronRight style={{ fontSize: "1.4em", color: "#3498ff" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;