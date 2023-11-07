-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2023 at 04:48 PM
-- Server version: 10.4.28-MariaDB
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
  `successful_commit` varchar(10) NOT NULL DEFAULT 'Pending',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commitbase`
--

INSERT INTO `commitbase` (`commit_id`, `contributor_id`, `commit_path`, `project_id`, `successful_commit`, `timestamp`) VALUES
('Commit1', 'C01', 'https://fefgergre.com', 'Project5', 'Accepted', '2023-10-27 08:44:13'),
('Commit3', 'C08', 'https://drive.google.com/file/d/1GjegepX80KVdvLCLkTfMxRBfiG6xP4On/view', 'Project5', 'Accepted', '2023-10-27 04:49:39'),
('Commit45', 'C01', 'http://localhost:5173/contributor/view-all-listed-projects', 'Project3', 'Accepted', '2023-11-03 14:50:02'),
('COmmitdf4', 'C01', 'ww.google.com', 'Project3', 'Accepted', '2023-11-03 14:51:12'),
('efwf', 'C01', 'wefwe', 'Project2', 'Accepted', '2023-11-03 15:01:25'),
('Hand', 'C10', 'wvveww', 'Project1', 'Pending', '2023-10-28 18:38:04'),
('wefwe', 'C01', 'ewfef', 'Project5', 'Accepted', '2023-11-03 15:03:29'),
('wfwef', 'C01', 'efwef', 'Project3', 'Accepted', '2023-11-03 15:03:08');

-- --------------------------------------------------------

--
-- Table structure for table `leaderboard`
--

CREATE TABLE `leaderboard` (
  `contributor_id` varchar(3) NOT NULL,
  `points` int(11) DEFAULT NULL,
  `commit_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nftbase`
--

CREATE TABLE `nftbase` (
  `token_id` varchar(64) NOT NULL,
  `worth` decimal(9,2) NOT NULL,
  `wallet_id` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `transaction_id` varchar(64) NOT NULL,
  `sender_wallet_id` varchar(64) NOT NULL,
  `receiver_wallet_id` varchar(64) NOT NULL,
  `token_id` varchar(64) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projectbase`
--

CREATE TABLE `projectbase` (
  `project_id` varchar(10) NOT NULL,
  `project_name` varchar(100) NOT NULL,
  `project_description` varchar(500) NOT NULL,
  `publisher_id` varchar(3) NOT NULL,
  `code_path` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projectbase`
--

INSERT INTO `projectbase` (`project_id`, `project_name`, `project_description`, `publisher_id`, `code_path`) VALUES
('Project1', 'App Development Toolkit', 'C++', 'P02', 'https://github.com/ahmed-develops/MERN/tree/main/server'),
('Project2', 'Hello World', 'A basic python script to print Hello World when windows logged in', 'P25', 'https://miro.com/app/board/uXjVMkmXgYQ=/'),
('Project3', 'Hospital Management System', 'HMS for Liaqat National Hospital', 'P25', 'http://localhost/phpmyadmin/index.php?route=/table/change&db=codetribute&table=projectbase'),
('Project4', 'Stack Underflow', 'Asewvrevin', 'P25', 'https://chat.openai.com/c/286135cf-55d4-45c3-9ae4-029ee44dd9ef'),
('Project5', 'CodSoft', 'Internship projects', 'P25', 'https://github.com/ahmed-develops/CODSOFT'),
('Project8', 'Game Development', 'A game developed', 'P25', 'https://flexstudent.nu.edu.pk/Login');

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
  `privilege` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone_number`, `privilege`) VALUES
('A01', 'Muhammad Ahmed', 'k213161@nu.edu.pk', 'manutd:*', '923052976751', 'admin'),
('C01', 'Muhammad Shaheer', 'k213323@nu.edu.pk', 'naiver', '923410286680', 'contributor'),
('C02', 'Zain Ali', 'k214870@nu.edu.pk', 'mostnaive', '923219216325', 'contributor'),
('C07', 'Cristiano Ronadaldo', 'k236969@nu.edu.pk', 'siuuuuuuuuu', '927765843169', 'Contributor'),
('C08', 'Babar Ashraf', 'k213202@nu.edu.pk', 'manutd:*', '923410286689', 'Contributor'),
('C10', 'Fahad Ahmed', 'k214926@nu.edu.pk', 'niggafahad', '923009216325', 'Contributor'),
('C11', 'Owais Ali', 'k213298@nu.edu.pk', 'hammas', '921234567890', 'Contributor'),
('C12', 'Ammad Hasan', 'k213218@nu.edu.pk', 'hammas', '921234567899', 'Contributor'),
('C13', 'Mohammad Ali', 'k213228@nu.edu.pk', 'hammas', '921234567897', 'Contributor'),
('C15', 'Mohammad Asif', 'k214258@nu.edu.pk', 'hammas', '921234567891', 'Contributor'),
('C19', 'Garfield Sobers', 'k213341@nu.edu.pk', 'johnnysins', '92876545321', 'contributor'),
('P01', 'Muhammad Anas', 'k214556@nu.edu.pk', 'naive', '923362171607', 'publisher'),
('P02', 'Taqi Baqir', 'k213175@nu.edu.pk', 'leastnaive', '923229216325', 'publisher'),
('P05', 'Zafar Khan', 'k204566@nu.edu.pk', 'localhoster', '923331112223', 'publisher'),
('P06', 'Rehan Ahmed', 'k234495@nu.edu.pk', 'qwerty01', '924445687436', 'Publisher'),
('P09', 'Saud Shakeel', 'k217445@nu.edu.pk', 'khalid', '927765843109', 'Publisher'),
('P19', 'Khan Ali', 'k237145@nu.edu.pk', 'khalid', '927765843101', 'Publisher'),
('P20', 'Jamshed Akbar', 'k214145@nu.edu.pk', 'khalid', '927765843108', 'Publisher'),
('P25', 'Rohan Shergil', 'k234041@nu.edu.pk', 'khalid1', '927765843117', 'Publisher');

-- --------------------------------------------------------

--
-- Table structure for table `walletbase`
--

CREATE TABLE `walletbase` (
  `wallet_id` varchar(64) NOT NULL,
  `owner_id` varchar(3) NOT NULL,
  `balance` decimal(9,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `walletbase`
--

INSERT INTO `walletbase` (`wallet_id`, `owner_id`, `balance`) VALUES
('0x0EA6E1226792Cb9A8D6014368B75518F6837e3d2', 'P25', NULL),
('0xB83D8CF642ed26AB95F65C06e071E26D0d95e373', 'C01', NULL);

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
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`contributor_id`);

--
-- Indexes for table `nftbase`
--
ALTER TABLE `nftbase`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `wallet_id` (`wallet_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`transaction_id`),
  ADD UNIQUE KEY `unique_token_at_each_transaction` (`token_id`),
  ADD KEY `sender_wallet_id` (`sender_wallet_id`),
  ADD KEY `receiver_wallet_id` (`receiver_wallet_id`);

--
-- Indexes for table `projectbase`
--
ALTER TABLE `projectbase`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `publisher_id` (`publisher_id`);

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
  ADD PRIMARY KEY (`wallet_id`),
  ADD UNIQUE KEY `unique_wallet_id` (`owner_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commitbase`
--
ALTER TABLE `commitbase`
  ADD CONSTRAINT `commitbase_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projectbase` (`project_id`),
  ADD CONSTRAINT `commitbase_ibfk_2` FOREIGN KEY (`contributor_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`contributor_id`) REFERENCES `commitbase` (`contributor_id`);

--
-- Constraints for table `nftbase`
--
ALTER TABLE `nftbase`
  ADD CONSTRAINT `nftbase_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `walletbase` (`wallet_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`sender_wallet_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`receiver_wallet_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`token_id`) REFERENCES `nftbase` (`token_id`);

--
-- Constraints for table `projectbase`
--
ALTER TABLE `projectbase`
  ADD CONSTRAINT `projectbase_ibfk_1` FOREIGN KEY (`publisher_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `walletbase`
--
ALTER TABLE `walletbase`
  ADD CONSTRAINT `walletbase_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
