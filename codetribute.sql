-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2023 at 03:49 PM
-- Server version: 10.4.28-MariaDB-log
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `codetribute`
--

-- --------------------------------------------------------

--
-- Table structure for table `commitbase`
--

CREATE TABLE `commitbase` (
  `commit_id` varchar(10) NOT NULL,
  `contributor_id` varchar(3) NOT NULL,
  `commit_path` varchar(500) NOT NULL,
  `project_id` varchar(10) NOT NULL,
  `commit_status` varchar(10) NOT NULL DEFAULT 'Pending',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commitbase`
--

INSERT INTO `commitbase` (`commit_id`, `contributor_id`, `commit_path`, `project_id`, `commit_status`, `timestamp`) VALUES
('Comit5996', 'C01', 'https://sepolia.etherscan.io/token/0xe2ca36365e40e81a8185bb8986d662501df5f6f2', 'Project4', 'Accepted', '2023-11-18 13:26:29'),
('Comit59961', 'C01', 'https://sepolia.etherscan.io/tokeen/0xe2ca36365e40e81a8185bb8986d662501df5f6f2', 'Project4', 'Accepted', '2023-11-18 13:30:34'),
('Commit1', 'C01', 'https://fefgergre.com', 'Project5', 'Accepted', '2023-10-27 08:44:13'),
('Commit3', 'C08', 'https://drive.google.com/file/d/1GjegepX80KVdvLCLkTfMxRBfiG6xP4On/view', 'Project5', 'Accepted', '2023-10-27 04:49:39'),
('Commit45', 'C01', 'http://localhost:5173/contributor/view-all-listed-projects', 'Project3', 'Accepted', '2023-11-03 14:50:02'),
('COmmitdf4', 'C01', 'ww.google.com', 'Project3', 'Accepted', '2023-11-03 14:51:12'),
('CommitTest', 'C01', 'https://www.forbes.com/sites/ninabambysheva/2023/02/09/ethereum-gears-up-for-next-big-upgrade-29-billion-of-ether-to-be-unlocked/', 'Project1', 'Pending', '2023-11-26 13:47:27'),
('Comtie345', 'C01', 'efwegwerg', 'Project2', 'Accepted', '2023-11-20 04:14:31'),
('Comtie3454', 'C01', 'efwegwerg32r23', 'Project2', 'Accepted', '2023-11-20 04:17:46'),
('efwf', 'C01', 'wefwe', 'Project2', 'Accepted', '2023-11-03 15:01:25'),
('fwgegbrg', 'C01', 'jwdfewfge', 'Project2', 'Rejected', '2023-11-18 18:38:07'),
('Hand', 'C10', 'wvveww', 'Project1', 'Pending', '2023-10-28 18:38:04'),
('wefwe', 'C01', 'ewfef', 'Project5', 'Accepted', '2023-11-03 15:03:29'),
('wfwef', 'C01', 'efwef', 'Project3', 'Accepted', '2023-11-03 15:03:08');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `transaction_id` varchar(64) NOT NULL,
  `sender_user_id` varchar(3) NOT NULL,
  `receiver_user_id` varchar(3) NOT NULL,
  `amount` int(11) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`transaction_id`, `sender_user_id`, `receiver_user_id`, `amount`, `timestamp`) VALUES
('0X3F23FI2FMI4FMN', 'C01', 'P06', 2000, '2023-11-19 10:13:02'),
('0xefef234ioiojfei', 'P25', 'C01', 1000, '2023-11-19 10:02:00'),
('1fc1b610cd35e5fdf3fcd76b528521b2c962d93b', 'C01', 'P25', 20000, '2023-11-19 20:00:50'),
('9ec187dbdca1dabdf7ca3a8a0fc8c25790be0c96', 'C01', 'P25', 2000, '2023-11-19 19:58:04'),
('ff2b8e5e0004c260929f28dcc81c3e4c932c9bf0', 'C01', 'P25', 200, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `projectbase`
--

CREATE TABLE `projectbase` (
  `project_id` varchar(10) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `project_description` varchar(500) NOT NULL,
  `publisher_id` varchar(3) NOT NULL,
  `code_path` varchar(500) NOT NULL,
  `tokens_offered` int(11) NOT NULL DEFAULT 0,
  `tokens_required` int(11) NOT NULL DEFAULT 0
) ;

--
-- Dumping data for table `projectbase`
--

INSERT INTO `projectbase` (`project_id`, `project_name`, `project_description`, `publisher_id`, `code_path`, `tokens_offered`, `tokens_required`) VALUES
('Project1', 'App Development Toolkit', 'C++', 'P02', 'https://github.com/ahmed-develops/MERN/tree/main/server', 300, 200),
('Project2', 'Hello World', 'A basic python script to print Hello World when windows logged in', 'P25', 'https://miro.com/app/board/uXjVMkmXgYQ=/', 300, 200),
('Project3', 'Hospital Management System', 'HMS for Liaqat National Hospital', 'P25', 'http://localhost/phpmyadmin/index.php?route=/table/change&db=codetribute&table=projectbase', 300, 200),
('Project4', 'Stack Underflow', 'Asewvrevin', 'P25', 'https://chat.openai.com/c/286135cf-55d4-45c3-9ae4-029ee44dd9ef', 300, 200),
('Project5', 'CodSoft', 'Internship projects', 'P25', 'https://github.com/ahmed-develops/CODSOFT', 300, 200),
('Project8', 'Game Development', 'A game developed', 'P25', 'https://flexstudent.nu.edu.pk/Login', 300, 200);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_log`
--

CREATE TABLE `transaction_log` (
  `log_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` varchar(3) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `operation_type` varchar(50) DEFAULT NULL,
  `query` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_log`
--

INSERT INTO `transaction_log` (`log_id`, `timestamp`, `user_id`, `table_name`, `operation_type`, `query`) VALUES
(5, '2023-11-25 15:29:45', 'C69', 'users', 'INSERT', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege VALUES (?,?,?,?,?,?)'),
(6, '2023-11-25 15:59:00', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shahee, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680, privilege=contributor WHERE user_id=C01'),
(7, '2023-11-25 16:00:10', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shaheer, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680, privilege=contributor WHERE user_id=C01'),
(9, '2023-11-25 16:37:15', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shah, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680, privilege=contributor WHERE user_id=C01'),
(10, '2023-11-25 16:45:09', 'A01', 'users', 'INSERT', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege VALUES (C78,Rajesh,rajesh@rajesh.com,password,21434234234,Contributor)'),
(11, '2023-11-25 16:45:40', 'A01', 'users', 'INSERT', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege VALUES (P99,Khanna,khanna@khanna.com,johnny,2412343215,Publisher)'),
(12, '2023-11-25 16:51:24', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shaheer, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(14, '2023-11-25 16:56:47', 'A01', 'users', 'INSERT', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege VALUES (C85,Hannah,hannah@hannah.com,imgood,34425245,Contributor)'),
(15, '2023-11-25 16:58:03', 'A01', 'users', 'INSERT', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege VALUES (P90,Graves,graves@graves.com,graves,24235346534,Publisher)'),
(16, '2023-11-25 16:59:23', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shahee, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(17, '2023-11-25 17:01:21', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shaheer, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(18, '2023-11-25 17:01:47', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shah, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(19, '2023-11-25 17:01:59', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shahe, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(20, '2023-11-25 17:02:27', 'A01', 'users', 'UPDATE', 'UPDATE users SET name=Muhammad Shaher, email=k213323@nu.edu.pk, password=naiver, phone_number=923410286680 WHERE user_id=C01'),
(22, '2023-11-26 13:47:27', 'C01', 'commitbase', 'INSERT', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (CommitTest,C01,https://www.forbes.com/sites/ninabambysheva/2023/02/09/ethereum-gears-up-for-next-big-upgrade-29-billion-of-ether-to-be-unlocked/,Project1)');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(3) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(16) NOT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `privilege` varchar(11) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'Active'
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone_number`, `privilege`, `status`) VALUES
('A01', 'Muhammad Ahmed', 'k213161@nu.edu.pk', 'manutd:*', '923052976751', 'admin', 'Active'),
('C01', 'Muhammad Shaher', 'k213323@nu.edu.pk', 'naiver', '923410286680', 'contributor', 'Active'),
('C02', 'Zain Ali', 'k214870@nu.edu.pk', 'mostnaive', '923219216325', 'contributor', 'Suspended'),
('C07', 'Cristiano Ronadaldo', 'k236969@nu.edu.pk', 'siuuuuuuuuu', '927765843169', 'Contributor', 'Suspended'),
('C08', 'Babar Ashraf', 'k213202@nu.edu.pk', 'manutd:*', '923410286689', 'Contributor', 'Suspended'),
('C10', 'Fahad Ahmed', 'k214926@nu.edu.pk', 'niggafahad', '923009216325', 'Contributor', 'Active'),
('C11', 'Owais Ali', 'k213298@nu.edu.pk', 'hammas', '921234567890', 'Contributor', 'Active'),
('C12', 'Ammad Hasan', 'k213218@nu.edu.pk', 'hammas', '921234567899', 'Contributor', 'Active'),
('C13', 'Mohammad Ali', 'k213228@nu.edu.pk', 'hammas', '921234567897', 'Contributor', 'Active'),
('C15', 'Mohammad Asif', 'k214258@nu.edu.pk', 'hammas', '921234567891', 'Contributor', 'Active'),
('C19', 'Garfield Sobers', 'k213341@nu.edu.pk', 'johnnysins', '92876545321', 'contributor', 'Active'),
('C26', 'Ole Saeter', 'ole@saeter.com', 'harunhamid', '03045256246', 'Contributor', 'Active'),
('C69', 'Johnny Bravo', 'johnny@bravo.com', 'johnny', '12345667765', 'Contributor', 'Active'),
('C78', 'Rajesh', 'rajesh@rajesh.com', 'password', '21434234234', 'Contributor', 'Active'),
('C85', 'Hannah', 'hannah@hannah.com', 'imgood', '34425245', 'Contributor', 'Active'),
('P01', 'Muhammad Anas', 'k214556@nu.edu.pk', 'naive', '923362171607', 'publisher', 'Active'),
('P02', 'Taqi Baqir', 'k213175@nu.edu.pk', 'leastnaive', '923229216325', 'publisher', 'Active'),
('P05', 'Zafar Khan', 'k204566@nu.edu.pk', 'localhoster', '923331112223', 'publisher', 'Active'),
('P06', 'Rehan Ahmed', 'k234495@nu.edu.pk', 'qwerty01', '924445687436', 'Publisher', 'Active'),
('P09', 'Saud Shakeel', 'k217445@nu.edu.pk', 'khalid', '927765843109', 'Publisher', 'Active'),
('P19', 'Khan Ali', 'k237145@nu.edu.pk', 'khalid', '927765843101', 'Publisher', 'Active'),
('P20', 'Jamshed Akbar', 'k214145@nu.edu.pk', 'khalid', '927765843108', 'Publisher', 'Active'),
('P25', 'Rohan Shergil', 'k234041@nu.edu.pk', 'khalid1', '927765843117', 'Publisher', 'Active'),
('P26', 'Harun Hamid', 'haroon@hamid.com', 'imadwasim', '03045235763', 'Publisher', 'Suspended'),
('P34', 'ahmed shakeel', 'ahmed@shakeel.com', 'manutd', '13245325234', 'Publisher', 'Active'),
('P44', 'Kemra', 'kemra@gmail.com', 'sfwefwe', '332523524542', 'Publisher', 'Active'),
('P56', 'Haroon Khan', 'haroon@khan.com', 'wqwefewf', '2143242432', 'Publisher', 'Active'),
('P76', 'Kamran Ghulam', 'kamran@ghulam.com', 'fwefwef', '13241341', 'Publisher', 'Active'),
('P86', 'Ali', 'ali@ali.com', 'fewfwe', '342352', 'Publisher', 'Active'),
('P90', 'Graves', 'graves@graves.com', 'graves', '24235346534', 'Publisher', 'Active'),
('P99', 'Khanna', 'khanna@khanna.com', 'johnny', '2412343215', 'Publisher', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `walletbase`
--

CREATE TABLE `walletbase` (
  `user_id` varchar(3) NOT NULL,
  `wallet_address` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `walletbase`
--

INSERT INTO `walletbase` (`user_id`, `wallet_address`) VALUES
('A01', '0x242c4eA92Dc29F4af6aE499dFe11FC083053EF5e'),
('C01', '0xeF3c34A27521f15ca5D132b91c511dEb94deaE0E'),
('P25', '0x118De23b4A3d1bD029b454C9c4a2B10Ee00218C7');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commitbase`
--
ALTER TABLE `commitbase`
  ADD PRIMARY KEY (`commit_id`),
  ADD UNIQUE KEY `commit_path` (`commit_path`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `contributor_id` (`contributor_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `receiver_user_id_fk` (`receiver_user_id`),
  ADD KEY `sender_user_id_fk` (`sender_user_id`);

--
-- Indexes for table `projectbase`
--
ALTER TABLE `projectbase`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `publisher_id` (`publisher_id`);

--
-- Indexes for table `transaction_log`
--
ALTER TABLE `transaction_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `walletbase`
--
ALTER TABLE `walletbase`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaction_log`
--
ALTER TABLE `transaction_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commitbase`
--
ALTER TABLE `commitbase`
  ADD CONSTRAINT `commitbase_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projectbase` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `commitbase_ibfk_2` FOREIGN KEY (`contributor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `receiver_user_id_fk` FOREIGN KEY (`receiver_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sender_user_id_fk` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projectbase`
--
ALTER TABLE `projectbase`
  ADD CONSTRAINT `projectbase_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaction_log`
--
ALTER TABLE `transaction_log`
  ADD CONSTRAINT `transaction_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `walletbase`
--
ALTER TABLE `walletbase`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
