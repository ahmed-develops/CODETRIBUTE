import React from 'react';

const ViewMyProfile = () => {
  const profileData = {
    name: 'John Doe',
    username: 'johndoe123',
    email: 'john.doe@example.com',
    bio: 'Passionate developer exploring the world of coding.',
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
        <p style={styles.bio}>{profileData.bio}</p>
        {/* Add more profile information as needed */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '50px',
  },
  avatarContainer: {
    marginBottom: '20px',
  },
  avatar: {
    width: '150px',
    height: '150px',
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
  bio: {
    color: '#777',
    margin: '10px 0',
  },
  // Add more styles for additional profile information
};

export default ViewMyProfile;
