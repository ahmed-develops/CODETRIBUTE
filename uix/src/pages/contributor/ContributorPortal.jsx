import ListImg from '../../assets/images/list.png';
import CommitImg from '../../assets/images/commit-icon.png';
import { NavLink } from 'react-router-dom';

const ContributorPortal = ({ loginCredentials }) => {
  return (
    <>
      {/* Navigational Units */}
      <div className="grid-box">
        <NavLink to="/contributor/view-all-listed-projects" className=" it-1">
          <img src={ListImg} className="item-icon" />
          <p className="item-header">ALL LISTED PROJECTS</p>
        </NavLink>
        <NavLink to="/contributor/view-my-commits" className=" it-3">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">VIEW MY COMMITS</p>
        </NavLink>
        <NavLink to="/wallet" className=" it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">WALLET</p>
        </NavLink>
      </div>
    </>
  );
};

export default ContributorPortal;
