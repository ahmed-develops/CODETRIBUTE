import React from 'react';
import ViewMyProfile from '../ViewMyProfile';
import { NavLink } from 'react-router-dom';
import CommitImg from '../../assets/images/commit-icon.png';
import ListImg from '../../assets/images/list.png';
import PayImg from '../../assets/images/pay.png';
import '../../assets/ContributorPortal.css';

const ContributorPortal = ({ loginCredentials }) => {
  return (
    <div className="Realgrid">
      <ViewMyProfile userdata={loginCredentials}/>

      <div className="grid-box">
        <NavLink to="/contributor/view-all-listed-projects" className="it-1">
          <img src={ListImg} className="item-icon" alt="List Icon" />
          <p className="item-header">ALL LISTED PROJECTS</p>
        </NavLink>
        <NavLink to="/contributor/view-my-commits" className="it-3">
          <img src={CommitImg} className="item-icon" alt="Commit Icon" />
          <p className="item-header">VIEW MY COMMITS</p>
        </NavLink>
        <NavLink to="/wallet" className="it-1">
          <img src={PayImg} className="item-icon" alt="Wallet Icon" />
          <p className="item-header">WALLET</p>
        </NavLink>
        <NavLink to="/view-activity-logs" className="it-1">
          <img src={PayImg} className="item-icon" alt="Wallet Icon" />
          <p className="item-header">VIEW YOUR ACTIVITY</p>
        </NavLink>
        <NavLink to="/view-leaderboard" className="it-1">
          <img src={PayImg} className="item-icon" alt="Wallet Icon" />
          <p className="item-header">VIEW LEADERBOARD</p>
        </NavLink>
      </div>
    </div>
  );
};

export default ContributorPortal;
