-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2023 at 06:28 PM
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
('CommitTest', 'C01', 'https://sepolia.etherscan.io/tokeen/0xe2ca36365e40e81a8185bb8986d662501df5f6f2', 'ProjectX', 'Rejected', '2023-12-07 08:39:13'),
('efwefew', 'C01', 'wdfewf', 'ProjectX', 'Accepted', '2023-12-07 08:56:09');

--
-- Triggers `commitbase`
--
DELIMITER $$
CREATE TRIGGER `commitbaseTriggerDelete` AFTER DELETE ON `commitbase` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('DELETE FROM commitbase WHERE commit_id = ', OLD.commit_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (OLD.contributor_id, 'DELETE', 'commitbase', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `commitbaseTriggerInsert` AFTER INSERT ON `commitbase` FOR EACH ROW BEGIN
  -- Declare a variable to store the SQL statement
  DECLARE sql_text LONGTEXT;

  -- Get the full SQL statement from information_schema
  SELECT CONCAT('INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (', NEW.commit_id, ', ', NEW.contributor_id, ', ', NEW.commit_path, ', ', NEW.project_id, ');')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  -- Insert data from the NEW row into transaction_log
  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.contributor_id, 'INSERT', 'commitbase', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `commitbaseTriggerUpdate` AFTER UPDATE ON `commitbase` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('UPDATE commitbase SET commit_id = ', NEW.commit_id, ', contributor_id = ', NEW.contributor_id, ', commit_path = ', NEW.commit_path, ', project_id = ', NEW.project_id, ', commit_status = ', NEW.commit_status, ', timestamp = ', NEW.timestamp, ' WHERE commit_id = ', OLD.commit_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.contributor_id, 'UPDATE', 'commitbase', sql_text);
END
$$
DELIMITER ;

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
('0fb4f29949b8c00f25a1a34bc5f7c593273bc7f7', 'A01', 'C01', 100, '2023-12-07 11:42:03'),
('4d6e0b140bc3e81e1cd95f51c4989f3a4a742eb4', 'A01', 'P25', 499, '2023-12-05 16:46:28'),
('56e055f2a2103a625ab444f80b942e33ef61462f', 'P25', 'A03', 12000, '2023-12-05 15:50:16'),
('79d1ed9a6b7de40267b47703b7930ec1d0e1f6d6', 'A01', 'P25', 100, '2023-12-07 00:53:30'),
('ec9925fa46e5a956a140626d97b312c47befd2f9', 'A03', 'P25', 2000, '2023-12-05 15:48:12');

--
-- Triggers `payments`
--
DELIMITER $$
CREATE TRIGGER `paymentTrigger` AFTER INSERT ON `payments` FOR EACH ROW BEGIN
  -- Declare a variable to store the SQL statement
  DECLARE sql_text LONGTEXT;

  -- Get the full SQL statement from information_schema
  SELECT CONCAT('INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (', NEW.sender_user_id, ', ', NEW.receiver_user_id, ', ', NEW.amount, ');')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  -- Insert data from the NEW row into transaction_log
  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.sender_user_id, 'INSERT', 'payments', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `paymentTriggerDelete` AFTER DELETE ON `payments` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('DELETE FROM payments WHERE transaction_id = ', OLD.transaction_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (OLD.sender_user_id, 'DELETE', 'payments', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `paymentTriggerUpdate` AFTER UPDATE ON `payments` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('UPDATE payments SET sender_user_id = ', NEW.sender_user_id, ', receiver_user_id = ', NEW.receiver_user_id, ', amount = ', NEW.amount, ', timestamp = ', NEW.timestamp, ' WHERE transaction_id = ', OLD.transaction_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.sender_user_id, 'UPDATE', 'payments', sql_text);
END
$$
DELIMITER ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projectbase`
--

INSERT INTO `projectbase` (`project_id`, `project_name`, `project_description`, `publisher_id`, `code_path`, `tokens_offered`, `tokens_required`) VALUES
('Project5', 'Hello', 'Yahoo', 'P25', 'http://localhost:3300', 10, 1000),
('ProjectX', 'Roblox', 'Roblox', 'P25', 'ewfwwfwef', 100, 50);

--
-- Triggers `projectbase`
--
DELIMITER $$
CREATE TRIGGER `projectbaseTriggerDelete` AFTER DELETE ON `projectbase` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('DELETE FROM projectbase WHERE project_id = ', OLD.project_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (OLD.publisher_id, 'DELETE', 'projectbase', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `projectbaseTriggerInsert` AFTER INSERT ON `projectbase` FOR EACH ROW BEGIN
  -- Declare a variable to store the SQL statement
  DECLARE sql_text LONGTEXT;

  -- Get the full SQL statement from information_schema
  SELECT CONCAT('INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (', NEW.project_id, ', ', NEW.project_name, ', ', NEW.project_description, ', ', NEW.publisher_id, ', ', NEW.code_path, ', ', NEW.tokens_offered, ', ', NEW.tokens_required, ');')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  -- Insert data from the NEW row into transaction_log
  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.publisher_id, 'INSERT', 'projectbase', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `projectbaseTriggerUpdate` AFTER UPDATE ON `projectbase` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('UPDATE projectbase SET project_name = ', NEW.project_name, ', project_description = ', NEW.project_description, ', publisher_id = ', NEW.publisher_id, ', code_path = ', NEW.code_path, ', tokens_offered = ', NEW.tokens_offered, ', tokens_required = ', NEW.tokens_required, ' WHERE project_id = ', OLD.project_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.publisher_id, 'UPDATE', 'projectbase', sql_text);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transaction_log`
--

CREATE TABLE `transaction_log` (
  `log_id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `actor_id` varchar(3) DEFAULT NULL,
  `operation_type` varchar(50) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `query` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_log`
--

INSERT INTO `transaction_log` (`log_id`, `timestamp`, `actor_id`, `operation_type`, `table_name`, `query`) VALUES
(27, '2023-12-05 10:48:12', 'A03', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (C01, P25, 2000);'),
(28, '2023-12-05 10:50:16', 'P25', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (P25, C01, 12000);'),
(29, '2023-12-05 11:29:32', 'P81', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (P81, Jahangir, jahangir@jahangir.com, imbatman12340, 03362175634, Publisher);'),
(30, '2023-12-05 11:46:28', 'A01', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (A01, P25, 499);'),
(31, '2023-12-05 16:43:05', 'A01', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (A01, C01, 99);'),
(32, '2023-12-05 16:44:44', 'P77', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (P77, Philipp Lahm, philipp@lahm.com, 123456789, 92435435435, Publisher);'),
(33, '2023-12-06 07:32:16', 'A02', 'INSERT', 'walletbase', 'INSERT INTO walletbase (user_id, wallet_address) VALUES (P01, 0x6DCFbB4a4BF7E2f41981f540694267D074e71730);'),
(34, '2023-12-06 07:42:50', 'P05', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project79, Blind can see, A device made to assist blind people with hearing and seeing., P05, http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=codetribute&table=projectbase, 0, 0);'),
(35, '2023-12-06 07:47:21', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (Commit3566, C02, bherhetrhrbrb, Project79);'),
(37, '2023-12-06 09:19:24', 'A03', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = Comit5996, contributor_id = C01, commit_path = https://sepolia.etherscan.io/token/0xe2ca36365e40e81a8185bb8986d662501df5f6f22432432, project_id = Project4, commit_status = Accepted, timestamp = 2023-11-18 18:26:29 WHERE commit_id = Comit5996;'),
(38, '2023-12-06 09:21:31', 'A03', 'DELETE', 'commitbase', 'DELETE FROM commitbase WHERE commit_id = Comit5996;'),
(39, '2023-12-06 10:57:53', 'A01', 'UPDATE', 'payments', 'UPDATE payments SET sender_user_id = A01, receiver_user_id = C01, amount = 91, timestamp = 2023-12-05 21:43:05 WHERE transaction_id = 1b91584e3a02badbfbf5d74fc987a3efa446ec50;'),
(40, '2023-12-06 10:59:39', 'A01', 'DELETE', 'payments', 'DELETE FROM payments WHERE transaction_id = 1b91584e3a02badbfbf5d74fc987a3efa446ec50;'),
(41, '2023-12-06 11:00:50', 'P02', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = App Development Toolkitfwef, project_description = C++, publisher_id = P02, code_path = https://github.com/ahmed-develops/MERN/tree/main/server, tokens_offered = 300, tokens_required = 200 WHERE project_id = Project1;'),
(42, '2023-12-06 11:01:32', 'P02', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project1;'),
(43, '2023-12-06 11:02:58', 'A01', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Ahmed, email = k213161@nu.edu.pk, password = manutd:*1, phone_number = 923052976751, privilege = admin, status = Active WHERE user_id = A01;'),
(48, '2023-12-06 11:45:59', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project8;'),
(49, '2023-12-06 13:26:26', 'P25', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = ergerg, project_description = ergterytery, publisher_id = P25, code_path = grerghterhgeg, tokens_offered = 300, tokens_required = 200 WHERE project_id = Project3;'),
(50, '2023-12-06 13:27:14', 'P25', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = wefwefwef, project_description = rgtergtr, publisher_id = P25, code_path = bbrttrbtr, tokens_offered = 300, tokens_required = 200 WHERE project_id = Project3;'),
(51, '2023-12-06 13:49:37', 'P25', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = 1111111111111, project_description = 111111111111111, publisher_id = P25, code_path = htttps:wsefwefwef, tokens_offered = 300, tokens_required = 200 WHERE project_id = Project3;'),
(52, '2023-12-06 14:33:43', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project2;'),
(53, '2023-12-06 14:33:54', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project3;'),
(54, '2023-12-06 14:35:05', 'A03', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Shaheer, email = k213323@nu.edu.pk, password = naiver, phone_number = 923410286680, privilege = contributor, status = Suspended WHERE user_id = C01;'),
(55, '2023-12-06 14:35:12', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Suspended WHERE user_id = P25;'),
(56, '2023-12-06 16:13:18', 'A01', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Ahmed, email = k213161@nu.edu.pk, password = manutd:*1, phone_number = 923052976751, privilege = admin, status = Active WHERE user_id = A01;'),
(57, '2023-12-06 17:10:55', 'C83', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (C83, ergerg, sdfgedfgdf, vdfdfbdfg, 924453453453, Contributor);'),
(58, '2023-12-06 17:14:35', 'P91', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (P91, Gasdsfd, wqefwefwe, 445645, 124132432453, Publisher);'),
(59, '2023-12-06 17:19:11', 'P55', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (P55, fwefwe, wfwefwe, wefwefwe, 325435343432, Publisher);'),
(60, '2023-12-06 17:22:05', 'A01', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Ahmed, email = k213161@nu.edu.pk, password = manutd:*1, phone_number = 923052976751, privilege = admin, status = Active WHERE user_id = A01;'),
(61, '2023-12-06 17:22:31', 'A02', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Anas, email = k214556@nu.edu.pk, password = naive, phone_number = 923362171607, privilege = Admin, status = Active WHERE user_id = P01;'),
(62, '2023-12-06 17:22:53', 'A03', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Shaheer, email = k213323@nu.edu.pk, password = naiver, phone_number = 923410286680, privilege = Admin, status = Suspended WHERE user_id = C01;'),
(63, '2023-12-06 17:23:04', 'A02', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Anas, email = k214556@nu.edu.pk, password = naive, phone_number = 923362171607, privilege = Admin, status = Active WHERE user_id = A02;'),
(64, '2023-12-06 17:23:08', 'A03', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Shaheer, email = k213323@nu.edu.pk, password = naiver, phone_number = 923410286680, privilege = Admin, status = Suspended WHERE user_id = A03;'),
(65, '2023-12-06 17:23:16', 'A03', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Shaheer, email = k213323@nu.edu.pk, password = naiver, phone_number = 923410286680, privilege = Admin, status = Active WHERE user_id = A03;'),
(66, '2023-12-06 17:23:21', 'A01', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Ahmed, email = k213161@nu.edu.pk, password = manutd:*1, phone_number = 923052976751, privilege = adminAdmin, status = Active WHERE user_id = A01;'),
(67, '2023-12-06 17:23:25', 'A01', 'UPDATE', 'users', 'UPDATE users SET name = Muhammad Ahmed, email = k213161@nu.edu.pk, password = manutd:*1, phone_number = 923052976751, privilege = Admin, status = Active WHERE user_id = A01;'),
(68, '2023-12-06 17:23:31', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali, email = k214870@nu.edu.pk, password = mostnaive, phone_number = 923219216325, privilege = Contributor, status = Suspended WHERE user_id = C02;'),
(69, '2023-12-06 17:23:43', 'C19', 'UPDATE', 'users', 'UPDATE users SET name = Garfield Sobers, email = k213341@nu.edu.pk, password = johnnysins, phone_number = 92876545321, privilege = Contributor, status = Active WHERE user_id = C19;'),
(70, '2023-12-06 17:23:48', 'P02', 'UPDATE', 'users', 'UPDATE users SET name = Taqi Baqir, email = k213175@nu.edu.pk, password = leastnaive, phone_number = 923229216325, privilege = Publisher, status = Active WHERE user_id = P02;'),
(75, '2023-12-06 17:28:12', 'C11', 'UPDATE', 'users', 'UPDATE users SET name = Owais Ali, email = k213298@nu.edu.pk, password = hammas, phone_number = 921234567890, privilege = Contributor, status = Active WHERE user_id = C11;'),
(76, '2023-12-06 17:28:22', 'C11', 'UPDATE', 'users', 'UPDATE users SET name = Owais Ali, email = k213298@nu.edu.pk, password = anime, phone_number = 921234567890, privilege = Contributor, status = Active WHERE user_id = C11;'),
(77, '2023-12-06 17:28:32', 'C12', 'UPDATE', 'users', 'UPDATE users SET name = Ammad Hasan, email = k213218@nu.edu.pk, password = batman, phone_number = 921234567899, privilege = Contributor, status = Active WHERE user_id = C12;'),
(78, '2023-12-06 17:28:45', 'C13', 'UPDATE', 'users', 'UPDATE users SET name = Mohammad Ali, email = k213228@nu.edu.pk, password = 123456, phone_number = 921234567897, privilege = Contributor, status = Active WHERE user_id = C13;'),
(79, '2023-12-06 17:29:10', 'C15', 'UPDATE', 'users', 'UPDATE users SET name = Mohammad Asif, email = k214258@nu.edu.pk, password = lionking, phone_number = 921234567891, privilege = Contributor, status = Active WHERE user_id = C15;'),
(80, '2023-12-06 17:29:21', 'C19', 'UPDATE', 'users', 'UPDATE users SET name = Garfield Sobers, email = k213341@nu.edu.pk, password = Larkana, phone_number = 92876545321, privilege = Contributor, status = Active WHERE user_id = C19;'),
(85, '2023-12-06 17:32:27', 'P05', 'UPDATE', 'users', 'UPDATE users SET name = Zafar Khan, email = k204566@nu.edu.pk, password = localhoster, phone_number = 923331112223, privilege = Publisher, status = Active WHERE user_id = P05;'),
(88, '2023-12-06 18:00:35', 'C10', 'UPDATE', 'users', 'UPDATE users SET name = Fahad Ahmed1, email = k214926@nu.edu.pk, password = niggafahad, phone_number = 923009216325, privilege = Contributor, status = Active WHERE user_id = C10;'),
(89, '2023-12-06 18:00:43', 'C10', 'UPDATE', 'users', 'UPDATE users SET name = Fahad Ahmed, email = k214926@nu.edu.pk, password = niggafahad, phone_number = 923009216325, privilege = Contributor, status = Active WHERE user_id = C10;'),
(90, '2023-12-06 19:47:52', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali, email = k214870@nu.edu.pk, password = mostnaive, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C02;'),
(91, '2023-12-06 19:48:01', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali, email = k214870@nu.edu.pk, password = mostnaive, phone_number = 923219216325, privilege = Contributor, status = Suspended WHERE user_id = C02;'),
(92, '2023-12-06 19:49:31', 'C10', 'UPDATE', 'users', 'UPDATE users SET name = Fahad Ahmed3, email = k214926@nu.edu.pk, password = niggafahad, phone_number = 923009216325, privilege = Contributor, status = Active WHERE user_id = C10;'),
(93, '2023-12-06 19:49:39', 'C10', 'UPDATE', 'users', 'UPDATE users SET name = Fahad Ahmed, email = k214926@nu.edu.pk, password = niggafahad, phone_number = 923009216325, privilege = Contributor, status = Active WHERE user_id = C10;'),
(94, '2023-12-06 19:53:30', 'A01', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (A01, P25, 100);'),
(95, '2023-12-06 19:54:49', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali, email = k214870@nu.edu.pk, password = mostnaive, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C02;'),
(96, '2023-12-06 19:56:50', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (53254, C01, sgsefeafaaef, Project4);'),
(97, '2023-12-06 19:58:29', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (3424, C01, ewfgewgw, Project4);'),
(98, '2023-12-06 22:47:35', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali, email = k214870@nu.edu.pk, password = mostnaive, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C01;'),
(99, '2023-12-06 23:11:23', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Active WHERE user_id = P25;'),
(100, '2023-12-06 23:13:47', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Active WHERE user_id = P25;'),
(101, '2023-12-06 23:36:43', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (3522352g, C01, wergsdfgdfg, Project4);'),
(102, '2023-12-07 00:16:40', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (yahooapp, fdwefwfw, fwewef, P25, wefwefwe, 200, 100);'),
(103, '2023-12-07 00:21:27', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (ewqfwefwe, eefwefef, wefwe, P25, wqeqwr, 200, 100);'),
(104, '2023-12-07 00:23:11', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Active WHERE user_id = P25;'),
(105, '2023-12-07 00:27:27', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Active WHERE user_id = P25;'),
(106, '2023-12-07 00:40:57', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (wefwefwef, gerggdf, vxcvxcvxcv, P25, wertewf, 200, 100);'),
(107, '2023-12-07 04:36:49', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = ewqfwefwe;'),
(108, '2023-12-07 04:54:15', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project4;'),
(109, '2023-12-07 04:59:31', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = wefwefwef;'),
(110, '2023-12-07 05:00:33', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = yahooapp;'),
(111, '2023-12-07 05:03:15', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project5;'),
(112, '2023-12-07 05:03:39', 'P25', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = Blind can see, project_description = A device made to assist blind people with hearing and seeing., publisher_id = P25, code_path = http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=codetribute&table=projectbase, tokens_offered = 0, tokens_required = 0 WHERE project_id = Project79;'),
(113, '2023-12-07 05:05:16', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project79;'),
(114, '2023-12-07 05:18:40', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Game, Roblox, fwefewfewf`, P25, efwefewfew, 100, 40);'),
(115, '2023-12-07 05:18:48', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Game;'),
(116, '2023-12-07 05:33:45', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (FWF, WGWGRWE, GERGERG, P25, WWERFWE, 100, 50);'),
(117, '2023-12-07 05:33:50', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = FWF;'),
(118, '2023-12-07 05:53:16', 'P45', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (P45, Ali, ali@gmail.com, ali123, 923052976452, Publisher);'),
(119, '2023-12-07 05:59:21', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (PROJECT1, project11, fwfqwfwe, P25, FEQWFWEFWE, 100, 200);'),
(120, '2023-12-07 06:00:10', 'P25', 'UPDATE', 'projectbase', 'UPDATE projectbase SET project_name = pROJECT2, project_description = Another game, publisher_id = P25, code_path = effee, tokens_offered = 100, tokens_required = 200 WHERE project_id = PROJECT1;'),
(121, '2023-12-07 06:00:22', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = PROJECT1;'),
(122, '2023-12-07 06:30:34', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali2, email = k214870@nu.edu.pk2, password = mostnaive2, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C01;'),
(123, '2023-12-07 06:30:43', 'C10', 'UPDATE', 'users', 'UPDATE users SET name = Fahad Ahmed, email = k214926@nu.edu.pk, password = niggafahad, phone_number = 923009216325, privilege = Contributor, status = Suspended WHERE user_id = C10;'),
(124, '2023-12-07 06:31:22', 'C08', 'UPDATE', 'users', 'UPDATE users SET name = Babar Ashraf, email = k213202@nu.edu.pk, password = manutd:*, phone_number = 923410286689, privilege = Contributor, status = Active WHERE user_id = C08;'),
(125, '2023-12-07 06:37:10', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project56, Minesweeper, A game, P25, game, 200, 100);'),
(126, '2023-12-07 06:37:33', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project56;'),
(127, '2023-12-07 06:37:53', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project1, Game, game, P25, game2, 1000, 100);'),
(128, '2023-12-07 06:39:32', 'C08', 'UPDATE', 'users', 'UPDATE users SET name = Babar Ashraf, email = k213202@nu.edu.pk, password = manutd:*, phone_number = 923410286689, privilege = Contributor, status = Active WHERE user_id = C08;'),
(129, '2023-12-07 06:40:12', 'C08', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (fwefw, C08, jwdfewfge, Project1);'),
(130, '2023-12-07 06:40:49', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali2, email = k214870@nu.edu.pk2, password = mostnaive2, phone_number = 923219216325, privilege = Contributor, status = Suspended WHERE user_id = C01;'),
(131, '2023-12-07 06:41:13', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali2, email = k214870@nu.edu.pk2, password = mostnaive2, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C01;'),
(132, '2023-12-07 06:41:30', 'C08', 'UPDATE', 'users', 'UPDATE users SET name = Babar Ashraf sABZWARI, email = k213202@nu.edu.pk, password = manutd:*, phone_number = 923410286689, privilege = Contributor, status = Active WHERE user_id = C08;'),
(133, '2023-12-07 06:42:03', 'A01', 'INSERT', 'payments', 'INSERT INTO payments (sender_user_id, receiver_user_id, amount) VALUES (A01, C01, 100);'),
(134, '2023-12-07 06:42:43', 'C98', 'INSERT', 'users', 'INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (C98, kAMRAN, kamran@kamran.com, dwffwef, 923543543534, Contributor);'),
(135, '2023-12-07 07:58:36', 'C01', 'UPDATE', 'users', 'UPDATE users SET name = Zain Ali2, email = k214870@nu.edu.pk2, password = mostnaive2, phone_number = 923219216325, privilege = Contributor, status = Active WHERE user_id = C01;'),
(136, '2023-12-07 07:59:08', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (ecewc, C01, vwevewv, Project1);'),
(137, '2023-12-07 08:09:16', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = ecewc, contributor_id = C01, commit_path = vwevewv, project_id = Project1, commit_status = Accepted, timestamp = 2023-12-07 12:59:08 WHERE commit_id = ecewc;'),
(138, '2023-12-07 08:09:19', 'C08', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = fwefw, contributor_id = C08, commit_path = jwdfewfge, project_id = Project1, commit_status = Accepted, timestamp = 2023-12-07 11:40:12 WHERE commit_id = fwefw;'),
(139, '2023-12-07 08:10:21', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project2, fwefwef, greqg, P25, efwefwef, 100, 200);'),
(140, '2023-12-07 08:10:28', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project2;'),
(141, '2023-12-07 08:15:05', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project1;'),
(142, '2023-12-07 08:18:38', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project5, Hello, Yahoo, P25, http://localhost:3300, 10, 1000);'),
(143, '2023-12-07 08:28:21', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (Project3, Mineswepper, Mineswepper, P25, http://minesweeper.com, 100, 100);'),
(144, '2023-12-07 08:35:09', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (CommitTest, C01, https://www.forbes.com/sites/ninabambysheva/2023/02/09/ethereum-gears-up-for-next-big-upgrade-29-billion-of-ether-to-be-unlocked/, Project3);'),
(145, '2023-12-07 08:35:25', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = CommitTest, contributor_id = C01, commit_path = https://www.forbes.com/sites/ninabambysheva/2023/02/09/ethereum-gears-up-for-next-big-upgrade-29-billion-of-ether-to-be-unlocked/, project_id = Project3, commit_status = Accepted, timestamp = 2023-12-07 13:35:09 WHERE commit_id = CommitTest;'),
(146, '2023-12-07 08:36:01', 'P25', 'DELETE', 'projectbase', 'DELETE FROM projectbase WHERE project_id = Project3;'),
(147, '2023-12-07 08:38:46', 'P25', 'INSERT', 'projectbase', 'INSERT INTO project (project_id, project_name, project_description, publisher_id, code_path, tokens_offered, tokens_required) VALUES (ProjectX, Roblox, Roblox, P25, ewfwwfwef, 100, 50);'),
(148, '2023-12-07 08:39:13', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (CommitTest, C01, https://sepolia.etherscan.io/tokeen/0xe2ca36365e40e81a8185bb8986d662501df5f6f2, ProjectX);'),
(149, '2023-12-07 08:44:44', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = CommitTest, contributor_id = C01, commit_path = https://sepolia.etherscan.io/tokeen/0xe2ca36365e40e81a8185bb8986d662501df5f6f2, project_id = ProjectX, commit_status = Rejected, timestamp = 2023-12-07 13:39:13 WHERE commit_id = CommitTest;'),
(150, '2023-12-07 08:56:09', 'C01', 'INSERT', 'commitbase', 'INSERT INTO commitbase (commit_id, contributor_id, commit_path, project_id) VALUES (efwefew, C01, wdfewf, ProjectX);'),
(151, '2023-12-07 08:56:35', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(152, '2023-12-07 08:57:48', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Rejected, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(153, '2023-12-07 08:58:54', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Pending, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(154, '2023-12-07 08:58:58', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(155, '2023-12-07 08:59:26', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(156, '2023-12-07 08:59:33', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(157, '2023-12-07 08:59:50', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Pending, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(158, '2023-12-07 09:00:19', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(159, '2023-12-07 09:00:40', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Pending, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;'),
(160, '2023-12-07 09:01:40', 'P25', 'UPDATE', 'users', 'UPDATE users SET name = Rohan Shergil, email = k234041@nu.edu.pk, password = khalid1, phone_number = 927765843117, privilege = Publisher, status = Active WHERE user_id = P25;'),
(161, '2023-12-07 09:02:25', 'C01', 'UPDATE', 'commitbase', 'UPDATE commitbase SET commit_id = efwefew, contributor_id = C01, commit_path = wdfewf, project_id = ProjectX, commit_status = Accepted, timestamp = 2023-12-07 13:56:09 WHERE commit_id = efwefew;');

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
  `status` varchar(10) NOT NULL DEFAULT 'Active',
  `wallet_address` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone_number`, `privilege`, `status`, `wallet_address`) VALUES
('A01', 'Muhammad Ahmed', 'k213161@nu.edu.pk', 'manutd:*1', '923052976751', 'Admin', 'Active', '0x242c4eA92Dc29F4af6aE499dFe11FC083053EF5e'),
('A02', 'Muhammad Anas', 'k214556@nu.edu.pk', 'naive', '923362171607', 'Admin', 'Active', '0x242c4eA92Dc29F4af6aE499dFe11FC083053EF5e'),
('A03', 'Muhammad Shaheer', 'k213323@nu.edu.pk', 'naiver', '923410286680', 'Admin', 'Active', '0x242c4eA92Dc29F4af6aE499dFe11FC083053EF5e'),
('C01', 'Zain Ali2', 'k214870@nu.edu.pk2', 'mostnaive2', '923219216325', 'Contributor', 'Active', '0xeF3c34A27521f15ca5D132b91c511dEb94deaE0E'),
('C08', 'Babar Ashraf sABZWARI', 'k213202@nu.edu.pk', 'manutd:*', '923410286689', 'Contributor', 'Active', '0x118de23b4a3d1bd029b454c9c4a2b10ee00218c7'),
('C10', 'Fahad Ahmed', 'k214926@nu.edu.pk', 'niggafahad', '923009216325', 'Contributor', 'Suspended', NULL),
('C11', 'Owais Ali', 'k213298@nu.edu.pk', 'anime', '921234567890', 'Contributor', 'Active', NULL),
('C12', 'Ammad Hasan', 'k213218@nu.edu.pk', 'batman', '921234567899', 'Contributor', 'Active', NULL),
('C13', 'Mohammad Ali', 'k213228@nu.edu.pk', '123456', '921234567897', 'Contributor', 'Active', NULL),
('C15', 'Mohammad Asif', 'k214258@nu.edu.pk', 'lionking', '921234567891', 'Contributor', 'Active', NULL),
('C19', 'Garfield Sobers', 'k213341@nu.edu.pk', 'Larkana', '92876545321', 'Contributor', 'Active', NULL),
('C26', 'Ole Saeter', 'ole@saeter.com', 'harunhamid', '03045256246', 'Contributor', 'Active', NULL),
('C69', 'Johnny Bravo', 'johnny@bravo.com', 'johnny', '12345667765', 'Contributor', 'Active', NULL),
('C78', 'Rajesh', 'rajesh@rajesh.com', 'password', '21434234234', 'Contributor', 'Active', NULL),
('C83', 'ergerg', 'sdfgedfgdf', 'vdfdfbdfg', '924453453453', 'Contributor', 'Active', NULL),
('C85', 'Hannah', 'hannah@hannah.com', 'imgood', '34425245', 'Contributor', 'Active', NULL),
('C98', 'kAMRAN', 'kamran@kamran.com', 'dwffwef', '923543543534', 'Contributor', 'Active', NULL),
('P02', 'Taqi Baqir', 'k213175@nu.edu.pk', 'leastnaive', '923229216325', 'Publisher', 'Active', NULL),
('P05', 'Zafar Khan', 'k204566@nu.edu.pk', 'localhoster', '923331112223', 'Publisher', 'Active', NULL),
('P06', 'Rehan Ahmed', 'k234495@nu.edu.pk', 'qwerty01', '924445687436', 'Publisher', 'Active', NULL),
('P09', 'Saud Shakeel', 'k217445@nu.edu.pk', 'khalid', '927765843109', 'Publisher', 'Active', NULL),
('P19', 'Khan Ali', 'k237145@nu.edu.pk', 'khalid', '927765843101', 'Publisher', 'Active', NULL),
('P20', 'Jamshed Akbar', 'k214145@nu.edu.pk', 'khalid', '927765843108', 'Publisher', 'Active', NULL),
('P25', 'Rohan Shergil', 'k234041@nu.edu.pk', 'khalid1', '927765843117', 'Publisher', 'Active', '0x94AcD4325f2688805f27C0E086284EC9EF518477'),
('P26', 'Harun Hamid', 'haroon@hamid.com', 'imadwasim', '03045235763', 'Publisher', 'Suspended', NULL),
('P34', 'ahmed shakeel', 'ahmed@shakeel.com', 'manutd', '13245325234', 'Publisher', 'Active', NULL),
('P44', 'Kemra', 'kemra@gmail.com', 'sfwefwe', '332523524542', 'Publisher', 'Active', NULL),
('P45', 'Ali', 'ali@gmail.com', 'ali123', '923052976452', 'Publisher', 'Active', NULL),
('P55', 'fwefwe', 'wfwefwe', 'wefwefwe', '325435343432', 'Publisher', 'Active', NULL),
('P56', 'Haroon Khan', 'haroon@khan.com', 'wqwefewf', '2143242432', 'Publisher', 'Active', NULL),
('P76', 'Kamran Ghulam', 'kamran@ghulam.com', 'fwefwef', '13241341', 'Publisher', 'Active', NULL),
('P77', 'Philipp Lahm', 'philipp@lahm.com', '123456789', '92435435435', 'Publisher', 'Active', NULL),
('P81', 'Jahangir', 'jahangir@jahangir.com', 'imbatman12340', '03362175634', 'Publisher', 'Active', NULL),
('P86', 'Ali', 'ali@ali.com', 'fewfwe', '342352', 'Publisher', 'Active', NULL),
('P87', 'Yahya', 'yahya@yahya.com', 'nucesfast', '923456753451', 'Publisher', 'Active', NULL),
('P90', 'Graves', 'graves@graves.com', 'graves', '24235346534', 'Publisher', 'Active', NULL),
('P91', 'Gasdsfd', 'wqefwefwe', '445645', '124132432453', 'Publisher', 'Active', NULL),
('P99', 'Khanna', 'khanna@khanna.com', 'johnny', '2412343215', 'Publisher', 'Active', NULL);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `email_check_trigger` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  IF NEW.email NOT LIKE '%@%.com' AND NEW.email NOT LIKE '%nu.edu.pk' THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Email must contain "@.com" or "@nu.edu.pk"';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `usersTriggerDelete` AFTER DELETE ON `users` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('DELETE FROM users WHERE user_id = ', OLD.user_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (OLD.user_id, 'DELETE', 'users', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `usersTriggerInsert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('INSERT INTO users (user_id, name, email, password, phone_number, privilege) VALUES (', NEW.user_id, ', ', NEW.name, ', ', NEW.email, ', ', NEW.password, ', ', NEW.phone_number, ', ', NEW.privilege, ');')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.user_id, 'INSERT', 'users', sql_text);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `usersTriggerUpdate` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
  DECLARE sql_text LONGTEXT;

  SELECT CONCAT('UPDATE users SET name = ', NEW.name, ', email = ', NEW.email, ', password = ', NEW.password, ', phone_number = ', NEW.phone_number, ', privilege = ', NEW.privilege, ', status = ', NEW.status, ' WHERE user_id = ', OLD.user_id, ';')
  INTO sql_text
  FROM information_schema.processlist
  WHERE id = CONNECTION_ID();

  INSERT INTO transaction_log (actor_id, operation_type, table_name, query)
  VALUES (NEW.user_id, 'UPDATE', 'users', sql_text);
END
$$
DELIMITER ;

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
  ADD KEY `user_id` (`actor_id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transaction_log`
--
ALTER TABLE `transaction_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

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
  ADD CONSTRAINT `TLOG_USERS` FOREIGN KEY (`actor_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
