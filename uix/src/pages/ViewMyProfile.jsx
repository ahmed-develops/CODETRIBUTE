import React, { useEffect } from 'react';
import Button from "react-bootstrap/esm/Button";

const ViewMyProfile = ({userdata}) => {
  if (!userdata) {
    return null;
  }
  
  console.table(userdata);
  const profileData = {
    name: userdata.name,
    username: userdata.user_id,
    email: userdata.email,
    phone_number: userdata.phone_number,
    privilege: userdata.privilege,
    status: userdata.status,
    avatar: 'https://imageio.forbes.com/specials-images/imageserve/63e5179bc38273483b361abf/Ethereum-coin-token-with-candlestick-chart-background--Digital-currency-/0x0.jpg?format=jpg&width=1440',
  };

  return (
    <div style={styles.container}>
      <div style={styles.avatarContainer}>
        <img src={profileData.avatar} alt="Profile Avatar" style={styles.avatar} />
      </div>
      <div style={styles.infoContainer}>
        <h1 style={styles.name}>{profileData.name}</h1>
        <p style={styles.username}>@{profileData.username}</p>
        <p style={styles.email}>{profileData.email}</p>
        <p style={styles.phone_number}>+{profileData.phone_number}</p>
        <p style={styles.privilege}>{profileData.privilege}</p>
        <p style={styles.status}>{profileData.status}</p>
        <hr/>
        <Button onClick={() => {
          window.location = '/';
          localStorage.removeItem("loginCredentials");
      
          setTimeout(() => { 
            setLoginCredentials(null);
            setLoginState(false);
          }, 200);
        }}>Logout</Button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    marginLeft: '10px',
    marginRight: '100px',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    border: '2px solid #7de5f6',
    borderRadius: '16px',
    maxWidth: '300px',
    marginTop: '75px',
    background: 'linear-gradient(#8A2BE2, #7de5f6, #7de5f6)'
  },
  avatarContainer: {
    marginBottom: '20px',
    
  },
  avatar: {
    marginTop: '20px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  infoContainer: {
    textAlign: 'center',
  },
  name: {
    fontSize: '24px',
    margin: '0',
  },
  username: {
    color: '#555',
    margin: '5px 0',
  },
  email: {
    color: '#555',
    margin: '5px 0',
  },
  phone_number: {
    color: '#555',
    margin: '5px 0',
  },
  privilege: {
    color: '#555',
    margin: '5px 0',
  },
  status: {
    color: '#008000',
    margin: '5px 0',
  }
  // Add more styles for additional profile information
};

export default ViewMyProfile;