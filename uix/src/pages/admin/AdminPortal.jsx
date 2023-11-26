import ListImg from '../../assets/images/list.png';
import CommitImg from '../../assets/images/commit-icon.png';
import { NavLink } from 'react-router-dom';

const AdminPortal = () => {
  return (
    <>
      <div className="grid-box">
        <NavLink to="/admin/manage-user-profile" className=" it-1">
          <img src={ListImg} className="item-icon" />
          <p className="item-header">MANAGE USER PROFILE</p>
        </NavLink>
        <NavLink to="/admin/view-system-logs" className=" it-3">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">VIEW LOGS</p>
        </NavLink>
        <NavLink to="/wallet" className=" it-1">
          <img src={CommitImg} className="item-icon" />
          <p className="item-header">WALLET</p>
        </NavLink>
      </div>
    </>
  );
};

export default AdminPortal;
