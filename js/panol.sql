CREATE DATABASE panol;
USE panol;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-11-2025 a las 00:11:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `panol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `id_devolucion` int(11) NOT NULL,
  `id_prestamo` int(11) NOT NULL,
  `cantidad_devuelta` int(11) NOT NULL,
  `hora` time DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devoluciones`
--

INSERT INTO `devoluciones` (`id_devolucion`, `id_prestamo`, `cantidad_devuelta`, `hora`, `fecha`) VALUES
(1, 2, 1, '16:42:35', '2025-10-28'),
(2, 1, 1, '16:44:10', '2025-10-28'),
(3, 2, 1, '16:45:17', '2025-10-28'),
(4, 3, 1, '17:04:07', '2025-10-28'),
(5, 5, 2, '02:09:58', '2025-10-29'),
(6, 6, 2, '20:17:00', '2025-10-29'),
(7, 4, 1, '20:53:36', '2025-10-29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientas`
--

CREATE TABLE `herramientas` (
  `id_herramienta` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `modelo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `cantidadAfectada` int(11) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `herramientas`
--

INSERT INTO `herramientas` (`id_herramienta`, `nombre`, `categoria`, `marca`, `modelo`, `descripcion`, `stock`, `cantidadAfectada`, `estado`, `img`) VALUES
(1, 'Sierra cicular', 'Carpintería', 'Skilsaw', '5402', '1400w, max=184mm, 220v, 50hz', 0, 1, 'Desaparecida', 'sierracircular.jpg'),
(2, 'Amoladora', 'Carpintería', 'Skilsaw', '9004', '220v,50/60hz,750w,n 11000/min', 0, 1, 'Normal', 'amoladora.jpg'),
(3, 'Sierra caladora', 'Carpintería', 'Black&Decker', 'KS410-AR', '410w, 60mm, 220v, 50hz, N0 3000/min', 1, 1, 'Desaparecida', 'sierraa.jpg'),
(4, 'Taladro de impacto', 'CarpinterÍa', 'Skil', '6055', '220v,50hz,550w,no 0-3000/min 13 mm', 2, 0, '', 'taladroimp.jpg'),
(5, 'Taladro', 'Carpintería', 'Robust', 'RB-ED 450 E', '450w, 0-3000 RPM, 10mm de mandril', 1, 0, '', 'robust.jpg'),
(6, 'Sierra sensitiva de banco', 'Carpintería', 'LUSQTOFF', 'CM1-K', 'Potencia de 2000w, velocidad de 3800rpm, 355mm de diametro de corte', 1, 0, '', 'sierra.jpg'),
(7, 'Atornillador de impacto', 'Carpintería', 'Gamma maglithion', 'HG102', '12vcc,3000/min, n.m 80', 2, 0, '', 'atornillador.jpg'),
(8, 'Calibre de acero.', 'Carpintería', 'Vernier Caliper', '-', '0-150mm X 0.02mm', 2, 0, '', 'vernier.jpg'),
(9, 'Percutor', 'Construcción', 'Skil', '-', '-', 1, 0, '', 'percutor.jpg'),
(10, 'Soldador instantaneo', 'Electricidad', 'Vesubio', 'C2', '220volts,50hz,100w', 2, 0, '', 'soldadorins.jpg'),
(11, 'Soporte de soldador', 'Electricidad', 'Sarasanto', 'SS-PLAECO', 'Lente de 60 mm,de acero', 3, 0, '', '11.jpg'),
(12, 'Lijadora inalambrica', 'Carpintería', 'Cinhell', 'TE-OS 18/1 LI', '-', 1, 0, '', ''),
(13, 'Cable tester', 'Electronica', 'Yahro', 'NSS-468A', 'CP J20 19T 0318', 2, 0, '', ''),
(14, 'Protoboard', 'Electronica', '-', '-', 'Protoboard', 13, 0, '', ''),
(15, 'Amoladora', 'Construcción', 'Robust', 'S1M-ZP14-115B', '230v,50hz,11000min,600w,115mm', 1, 0, '', 'mola.jpg'),
(16, 'Lijadora de palma', 'Carpintería', 'Skil', '7232', '220v,50hz,200w,n 14000/min', 1, 0, '', 'lijadorapalma.jpg'),
(17, 'Caja de llaves', 'Herreria', 'Biassonic', '-', '-', 1, 0, '', ''),
(18, 'Caja de llaves', 'Herreria', '(sin marca)', '-', '-', 1, 0, '', ''),
(19, 'Limador triangular', 'Carpintería', 'Black jack', 'K032', '200mm', 4, 0, '', ''),
(20, 'Limador doble cara', 'Carpintería', 'Nicholson', '-', '32cm', 2, 0, '', ''),
(21, 'Limador cuadrado', 'Carpintería', 'Black Jack', 'K034', '200mm', 3, 0, '', '21.jpg'),
(22, 'Limador redondo', 'Carpintería', 'Nicholson', 'cooper hand tools-', 'limador 150mm', 2, 0, '', '22.jpg'),
(23, 'Escofina', 'Carpintería', '-', '-', 'EScofina plana punta cuadrada 29cm', 3, 0, '', '23.jpg'),
(24, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho', 7, 0, '', ''),
(25, 'Serrucho chico', 'Carpintería', '-', '-', 'Serrucho chico', 5, 0, '', ''),
(26, 'Sierra', 'Carpintería', 'Crossmaster', '994 00 54', '32cm', 5, 0, '', '26.jpg'),
(27, 'Maza', 'Carpintería', '', '-', '5 de diametro', 2, 0, '', '27.jpg'),
(28, 'Martillo carpintero', 'Carpintería', '-', '-', 'Martillo', 9, 0, '', '28.jpg'),
(29, 'Martillo saca clavo', 'Carpintería', '-', '-', 'Martillo', 3, 0, '', '29.jpg'),
(30, 'Martillo golpeador', 'Carpintería', '-', '-', 'Martillo', 6, 0, '', '30.jpg'),
(31, 'Regla de metal 50cm', 'Carpintería', 'MC', '-', '50 cm', 1, 0, '', ''),
(32, 'Escuadras de metal', 'Carpintería', 'Ruhlmann', 'RU15500', 'de 90º a 45º', 10, 0, '', '32.jpg'),
(33, 'Pinza', 'electricidad', 'Mota spain', '-', '-', 1, 0, '', ''),
(34, 'Destornillador plano', 'Electricidad', 'Rimo', '-', '-', 18, 0, '', ''),
(35, 'Destornillador cruz', 'Carpintería', 'Bulit', '60900', 'Serie 800,8pha 1x100', 28, 0, '', '35.jpg'),
(36, 'Serrucho angular', 'Carpintería', 'Bulit', '-', 'Serrucho angular 40 cm de largo punta triangular', 2, 0, '', 'serru36.jpg'),
(37, 'Regla de metal 60cm', 'Carpintería', 'MC', '-', '60 cm', 11, 0, '', ''),
(38, 'Regla de metal 30cm', 'Carpintería', 'MC', '-', '30 cm', 11, 0, '', ''),
(39, 'Escuadra carpintero', 'Carpintería', 'Black Jack', '-', '30 cm', 5, 0, '', ''),
(40, 'Multimetro digital', 'Electronica', 'Multimeter', 'DT-830B', 'Voltaje, resistencia y temperatura', 12, 0, '', '40.jpg'),
(41, 'Escofina redonda bastarda', 'Carpintería', 'Barovo', 'EMCB200', '200mm, media caña, mango de doble inyeccion', 29, 0, '', '41.jpg'),
(42, 'Alicate 4 1/2\" bulit', 'Carpintería', 'Bulit', '4 medio', 'Serie 600, mango antideslizante, filo cementado', 4, 0, '', '42.jpg'),
(43, 'Pinza universal 4 1/2\" bulit', 'Carpintería', 'Bulit', '-', '1/2\"', 6, 0, '', ''),
(44, 'Martillo bolita (nuevo)', 'Carpintería', 'Black Jack', 'g003', '300g, acero forjado', 6, 0, '', ''),
(45, 'Destornillador aislado', 'Carpintería', 'Mota', 'DAH1', 'PH1x100, punta imantada', 8, 0, '', '45.jpg'),
(46, 'Serrucho', 'Carpintería', 'Crossmaster', '997 18 44', '305mm,12\", dientes de 3 filos', 1, 0, '', ''),
(47, 'Pin punches 1/4\"', 'Carpintería', 'Bremen', '3941', '1/4\"', 6, 0, '', ''),
(48, 'Fresadora 1831', 'Carpintería', 'Skil', '1831', '1100w(127v)/1100w(220v)', 1, 0, '', '48.jpg'),
(49, 'Prensa 6\"', 'Carpintería', 'Workpro', '-', '-', 2, 0, '', '49.jpg'),
(50, 'Prensa 5\"', 'Carpintería', 'Labor', '-', '-', 4, 0, '', '´50.jpg'),
(51, 'Alicate universal 7\"', 'Carpintería', 'Black Jack', 'B076', '7\",corte diagonal y oblicuo', 11, 0, '', '51.jpg'),
(52, 'Escuadra de acero ancha', 'Carpintería', 'Black Jack', 'd080', '250mm', 5, 0, '', '52.jpg'),
(53, 'Pin punches 3/16\"', 'Carpintería', 'Bremen', '3941', '3/16\"', 1, 0, '', '53.jpg'),
(54, 'Punta de trazar 225mm', 'Carpintería', 'Bremen', 'CR-V', '225mm de largo, anti deslizante', 2, 0, '', '54.jpg'),
(55, 'Llave ajustable 8\"', 'Carpintería', 'Bulit', 'PZA S6 AJ8', 'serie 600,8\",203mm', 1, 0, '', '55.jpg'),
(56, 'Mecha pala 14mm', 'Carpintería', 'Kabura', '-', '14mm', 1, 0, '', '56.jpg'),
(57, 'Serrucho dientes sementados', 'Carpintería', 'Bulit', 'SR UPR 400', 'Bulit 400, 500 y 550mm (1 de cada uno)', 3, 0, '', '57.jpg'),
(58, 'Balanza de cocina', 'Electronica', 'Kanjihome', 'KJH-c12000', '2000g x 01g, 2 baterias AAA', 1, 0, '', ''),
(59, 'Desktop switch', 'Electronica', 'Switch', '-', '10/100mbps tp-link', 3, 0, '', ''),
(60, 'Router wifi multimodo', 'Electronica', 'Multimodo', '-', '300 mbps tp-link', 2, 0, '', ''),
(61, 'Camara de seguridad cue 2', 'Electronica', 'IMOU', '-', '1080p', 1, 0, '', ''),
(62, 'Tripode', 'electronica', 'phottix', '-', '-', 1, 0, '', ''),
(63, 'Soldador', 'Electricidad', 'JA', 'JA-5040 40w', '20-1000w', 3, 0, '', '63.jpg'),
(64, 'Remachadora manual', 'Carpintería', 'Black Jack', 'RM10', 'Mango ergonomico, 4 boquillas intercambiables', 2, 0, '', ''),
(65, 'Soporte de plaquetas con lupa', 'Electronica', 'Sarasanto', 'SS-PLAECO', 'Diametro de lente de 60 mm, cuerpo de acero', 2, 0, '', '65.jpg'),
(66, 'Llamador musical', 'Electronica', 'Waxon', '1822', '2 tonos,220v', 1, 0, '', ''),
(67, 'Sensor de humo', 'Electronica', 'Digital display instrument', 'SR-510A', 'Rango de temperatura de -20 a 60°c', 2, 0, '', ''),
(68, 'Tiras led', 'Electricidad', '-', '-', 'Practiled', 5, 0, '', ''),
(69, 'Casco', 'Herreria', 'Tecnoweld', '-', '-', 4, 0, '', ''),
(70, 'Guantes', 'Herreria', '-', '-', 'Cantidad por bolsones', 6, 0, '', ''),
(71, 'Tester', 'Electronica', 'Master', 'CPJ20 19T 0318', 'RJ-45 y RJ-11', 9, 0, '', ''),
(72, 'Mini usb 2.0 cable', 'Electronica', 'Vapex', 'lta019', '5 pin male', 4, 0, '', ''),
(73, 'Cinta lijadora', 'Carpintería', '-', '-', '-', 1, 0, '', ''),
(74, 'Escuadra metalica', 'Carpintería', '-', '-', '-', 9, 0, '', ''),
(75, 'Formon', 'Carpintería', '-', '-', '-', 9, 0, '', ''),
(76, 'Limador', 'Carpintería', 'Black Jack', '-', 'cuadrado bastarda 30,5cm', 6, 0, '', ''),
(77, 'Cuerda rugosa', 'Carpintería', '-', '-', '-', 6, 0, '', '77.jpg'),
(78, 'Cinzel de madera', 'Carpintería', '-', '-', '-', 2, 0, '', ''),
(79, 'Lima paralela bastarda', 'Carpintería', '-', '-', '', 1, 0, '', '79.jpg'),
(80, 'Antiguo gran formon', 'Carpintería', '-', '-', 'triangular, mango madera', 1, 0, '', '80.jpg'),
(81, 'Pinzas pela cables', 'Carpintería', '-', '-', '20mm, funcionan solo 2', 9, 0, '', ''),
(82, 'Prensas sargento (rotas)', 'Carpintería', '-', '-', '50x300', 10, 0, '', ''),
(83, 'Prensa 4\"', 'Carpintería', 'Black Jack', 'C137', '-', 1, 0, '', ''),
(84, 'Prensa sargento carpintero', 'Carpintería', '-', '-', '200 mm', 1, 0, '', ''),
(85, 'Prensa sargento', 'Carpintería', '-', '-', '80x400', 2, 0, '', ''),
(86, 'Prensa sargento', 'Carpintería', '-', '-', '50x200', 1, 0, '', ''),
(87, 'Llave inglesa', 'Carpintería', 'Bahco', 'ud', '27 y 32', 1, 0, '', ''),
(88, 'Miniserruchos', 'Carpintería', '-', '-', '-', 5, 0, '', ''),
(89, 'Espatulas', 'Carpintería', '-', '-', '-', 6, 0, '', ''),
(90, 'Pinceles', 'Carpintería', '-', '-', '-', 2, 0, '', ''),
(91, 'Soldadores', 'Electronica', 'JA', 'JA-3040', '230v,50hz,40w', 11, 0, '', ''),
(92, 'Pistola de silicona', 'Electricidad', 'Suprabond', 'px 300', '220v,50hz,40w', 4, 0, '', ''),
(93, 'Bomba succionadora de estaño', 'Herreria', '-', '-', '-', 2, 0, '', ''),
(94, 'Cargadores de pila', 'Electricidad', 'Energizer', '-', '100v-240v,50/60hz,6w', 6, 0, '', ''),
(95, 'Pilas no recargables', 'Electronica', '-', '-', 'pilas de 1,5v', 20, 0, '', ''),
(96, 'Pilas recargables', 'Electronica', '-', '-', 'pilas de 6v', 7, 0, '', ''),
(97, 'Baterias de 9 voltios', 'Electronica', '-', '-', 'pilas de 9v', 7, 0, '', ''),
(98, 'Tablero tecnico', 'Carpintería', '-', '-', '-', 6, 0, '', ''),
(99, 'Tablero para dibujar', 'Carpintería', '-', '-', '-', 50, 0, '', ''),
(100, 'Regla t hecha por alumnos', 'Carpintería', '-', '-', '-', 14, 0, '', ''),
(101, 'Inglete para madera con serrucho', 'Carpintería', 'Power', 'c110', 'para cortes de 45º/90º/180º', 4, 0, '', ''),
(102, 'Bateria recargable', 'Electronica', '-', '-', 'pr1240(12v4ah/20hr)', 2, 0, '', ''),
(103, 'Luz de emergencia', 'Electricidad', 'W Baw', 'llede60m', 'versatil compacta funcional', 4, 0, '', '103.jpg'),
(104, 'Protectores auditivo tipo concha', 'Carpintería', '-', '-', 'libus', 2, 0, '', ''),
(105, 'Escofina', 'Carpintería', 'Rat-file', '-', 'media caña para madera 200mm gruesa', 1, 0, '', '105.jpg'),
(106, 'Escofina', 'Carpintería', 'Black Jack', '-', 'acero forjado, de punta cuadrada, 200mm', 4, 0, '', ''),
(107, 'Escofina', 'Carpintería', '', '-', 'media caña, gruesa 8 pulgadas', 1, 0, '', ''),
(108, 'Limador', 'Carpintería', 'Nicholson', '-', 'Triangular bastarda 8 pulgadas', 3, 0, '', ''),
(109, 'Limador', 'Carpintería', 'Nicholson', '-', 'Cuadrada 10 pulgadas (250mm)', 1, 0, '', ''),
(110, 'Limador', 'Carpintería', 'Nicholson', '-', 'Cuadrada 32cm', 1, 0, '', ''),
(111, 'Limador doble cara', 'Carpintería', 'Nicholson', '-', '39cm', 2, 0, '', '111.jpg'),
(112, 'Escofina', 'Carpintería', 'Black Jack', '-', 'Recta con punta diamantada 32cm', 2, 0, '', '112.jpg'),
(113, 'Escofina', 'Carpintería', 'Rat-file', '-', 'Recta con punta recta 28cm fina', 3, 0, '', '113.jpg'),
(114, 'Escofina', 'Carpintería', 'Rat-file', '-', 'Mango plastico amarillo 30cm punta recta', 3, 0, '', '114.jpg'),
(115, 'Limador', 'Carpintería', 'Black Jack', '-', 'Doble cara, punta diamante, 37cm', 2, 0, '', ''),
(116, 'Limador', 'Carpintería', 'Black Jack', '-', 'Punta recta con pancita 30cm', 2, 0, '', '116.jpg'),
(117, 'Limador', 'Carpintería', 'Black Jack', '-', 'Cuadrado bastarda 30,5cm', 1, 0, '', '117.jpg'),
(118, 'Limador', 'Carpintería', 'Nicholson', '-', 'Limador triangular 30cm', 2, 0, '', '118.jpg'),
(119, 'Limador', 'Carpintería', 'Nicholson', '-', 'Media caña 29cm', 2, 0, '', '119.jpg'),
(120, 'Escofina', 'Carpintería', 'Nicholson', '-', 'Escofina cuadrada 8 pulgadas', 1, 0, '', '120.jpg'),
(121, 'Escofina', 'Carpintería', '-', '-', 'Escofina de punta diamantada 12 pulgadas', 2, 0, '', '121.jpg'),
(122, 'Lima', 'Carpintería', 'Plena', '-', 'Lima de punta diamantada 43cm', 1, 0, '', '122.jpg'),
(123, 'Lima', 'Carpintería', 'Plena', '-', 'Lima de punta diamantada 36cm', 1, 0, '', '123.jpg'),
(124, 'Lima', 'Carpintería', 'Plena', '-', 'Lima de punta diamantada 29cm', 1, 0, '', '124.jpg'),
(125, 'Lima', 'Carpintería', 'Nicholson', '-', 'Lima cuadrada con punta diamantada 32cm', 1, 0, '', '125.jpg'),
(126, 'Lima', 'Carpintería', 'Black Jack', '-', 'Lima de punta cuadrada 32cm', 1, 0, '', '126.jpg'),
(127, 'Lima', 'Carpintería', 'Llusa', '-', 'Lima gruesa cuadrada 32cm', 1, 0, '', '127.jpg'),
(128, 'Lima', 'Carpintería', 'Nicholson', '-', 'Lima fina cuadrada con punta diamantada 31.5cm', 1, 0, '', '128.jpg'),
(129, 'Escofina', 'Carpintería', '-', '-', 'Escofina cuadrada con punta diamantada 36cm', 1, 0, '', '129.jpg'),
(130, 'Lima', 'Carpintería', 'Nicholson', '-', 'Lima plana con punta cuadrada 25cm', 1, 0, '', '130.jpg'),
(131, 'Escofina', 'Carpintería', '-', '-', 'Escofina con punta cuadrada 32cm', 1, 0, '', '131.jpg'),
(132, 'Escofina', 'Carpintería', '-', '-', 'Escofina plana con punta cuadrada doblada 24.5cm', 1, 0, '', '132.jpg'),
(133, 'Lima', 'Carpintería', 'Nicholson', '-', 'Lima con punta cuadrada con panzita 37.5cm', 1, 0, '', '133.jpg'),
(134, 'Lima', 'Carpintería', 'Brother', '-', 'Lima circular gruesa 30.5cm', 1, 0, '', '134.jpg'),
(135, 'Lima', 'Carpintería', 'Brother', '-', 'Lima circular fina 30.5cm', 1, 0, '', '135.jpg'),
(136, 'Escofina', 'Carpintería', 'Nicholson', '-', 'Escofina con panzita de punta diamantada 12 pulgadas', 1, 0, '', '136.jpg'),
(137, 'Lima', 'Carpintería', 'Nicholson', '-', 'Lima circular fina 30.5cm', 1, 0, '', '137.jpg'),
(138, 'Lima', 'Carpintería', 'Llusa', '-', 'Lima diamantada 12.5 pulgadas', 1, 0, '', '138.jpg'),
(139, 'Lima', 'Carpintería', 'Brother', '-', 'Lima circular gruesa 31cm', 1, 0, '', '139.jpg'),
(140, 'Formon', 'Carpintería', 'Truper', 'FT-3/8', '9.5mm', 1, 0, '', '140.jpg'),
(141, 'Lima', 'Carpintería', 'Black Jack', '-', 'Lima diamantada 30cm', 1, 0, '', '141.jpg'),
(142, 'Serrucho', 'Carpintería', 'Simetal', '-', 'Serrucho mango de madera 30cm ancho 8.5cm', 2, 0, '', 'serru142.jpg'),
(143, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho mango de madera 30cm ancho 9.5cm', 1, 0, '', 'serrumader.jpg'),
(144, 'Serrucho', 'Carpintería', 'Santa Juana', '-', 'Serrucho 25cm largo 9.5cm', 1, 0, '', 'serru144.jpg'),
(145, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho 30cm largo 10cm mango plastico gris', 2, 0, '', ''),
(146, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho 30cm largo 10cm mango plastico amarillo', 1, 0, '', 'serruamarillo.jpg'),
(147, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho angular 39.5cm largo punta triangular mango madera', 3, 0, '', 'serru147.jpg'),
(148, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho angular 38cm largo punta triangular mango plastico azul', 2, 0, '', 'serru148.jpg'),
(149, 'Serrucho', 'Carpintería', 'Santa Juana', '-', 'Serrucho angular 40.5cm largo mango plastico', 1, 0, '', ''),
(150, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho angular 40cm largo mango plastico naranja con negro', 1, 0, '', ''),
(151, 'Serrucho', 'Carpintería', '-', '-', 'Serrucho angular 40.5cm largo mango plastico amarillo y negro', 1, 0, '', ''),
(152, 'Serrucho', 'Carpintería', 'Stanley', '-', 'Serrucho angular 55cm largo mango madera', 1, 0, '', 'serru152.jpg'),
(153, 'Serrucho', 'Carpintería', 'Stanley', '-', 'Serrucho angular 50cm largo mango madera (le falta tornillo)', 1, 0, '', 'serru153.jpg'),
(154, 'Regla de metal 50cm', 'Carpintería', 'Bremen', '-', '50 cm', 1, 0, '', ''),
(155, 'Escofina', 'Carpintería', 'Black Jack', '-', 'Escofina 27cm punta cuadrada', 1, 0, '', '155.jpg'),
(156, 'Sierra', 'Carpintería', '-', '-', 'Mango azul 31cm', 3, 0, '', '156.jpg'),
(157, 'Sierra', 'Carpintería', 'Eclipse20t', '-', 'Mango de metal', 2, 0, '', '157.jpg'),
(158, 'Sierra', 'Carpintería', 'Bahco', '-', 'Mango de metal 30cm', 3, 0, '', ''),
(159, 'Sierra', 'Carpintería', '-', '-', '30cm mango fino rojo', 1, 0, '', '159.jpg'),
(160, 'Sierra', 'Carpintería', '-', '-', 'Sin descripcion', 1, 0, '', '160.jpg'),
(161, 'Martillo saca clavo', 'Carpintería', '-', '-', 'Chico punta cuadrada', 1, 0, '', '161.jpg'),
(162, 'Maza grande', 'Carpintería', '-', '-', 'Diametro 6.5cm', 1, 0, '', '162.jpg'),
(163, 'Maza amarilla', 'Carpintería', '-', '-', 'Mango de goma', 3, 0, '', '163.jpg'),
(164, 'Maza cuadrada', 'Carpintería', '-', '-', 'Mango de madera desgastado', 1, 0, '', ''),
(165, 'Maza de goma', 'Carpintería', '-', '-', '4cm diametro', 1, 0, '', ''),
(166, 'Maza de hierro', 'Carpintería', '-', '-', 'Maza de hierro', 1, 0, '', '166.jpg'),
(167, 'Pinza', 'Electricidad', 'Black Jack', '-', 'Pinza corta cable', 5, 0, '', ''),
(168, 'Pinza', 'Electricidad', 'Silvershadow', '-', 'Pinza corta cable', 3, 0, '', ''),
(169, 'Pinza', 'Electricidad', '-', '-', 'Pinza corta cable mango fuccia punta larga', 1, 0, '', ''),
(170, 'Pinza', 'Electricidad', 'Crossmaster', '-', 'Pinza punta larga', 1, 0, '', ''),
(171, 'Pinza', 'Electricidad', 'Bremen', '-', 'Pinza corta cable mango azul de goma', 1, 0, '', ''),
(172, 'Pinza', 'Electricidad', 'Bulit', '-', 'Pinza corta cable', 4, 0, '', ''),
(173, 'Pinza', 'Electricidad', '-', '-', 'Pinzas viejas', 5, 0, '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramientasrotas`
--

CREATE TABLE `herramientasrotas` (
  `id_hrotas` int(11) NOT NULL,
  `id_herramienta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `herramientasrotas`
--

INSERT INTO `herramientasrotas` (`id_hrotas`, `id_herramienta`) VALUES
(2, 1),
(1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodevuelto`
--

CREATE TABLE `nodevuelto` (
  `id_nodevuelto` int(11) NOT NULL,
  `id_herramienta` int(11) DEFAULT NULL,
  `profesor` varchar(100) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_registro` date NOT NULL,
  `id_prestamo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nodevuelto`
--

INSERT INTO `nodevuelto` (`id_nodevuelto`, `id_herramienta`, `profesor`, `cantidad`, `fecha_registro`, `id_prestamo`) VALUES
(1, 39, 'rocho', 1, '2025-10-29', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id_prestamo` int(11) NOT NULL,
  `id_herramienta` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `profesor` varchar(255) DEFAULT NULL,
  `curso` varchar(255) DEFAULT NULL,
  `turno` varchar(255) DEFAULT NULL,
  `fecha_p` date DEFAULT NULL,
  `horaRetiro` time DEFAULT NULL,
  `horaLimite` time DEFAULT NULL,
  `estado_p` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prestamos`
--

INSERT INTO `prestamos` (`id_prestamo`, `id_herramienta`, `cantidad`, `profesor`, `curso`, `turno`, `fecha_p`, `horaRetiro`, `horaLimite`, `estado_p`) VALUES
(1, 1, 0, 'hector', '7mo 3ra', 'Vespertino', '2025-10-28', '12:16:19', '21:30:00', 'Devuelto'),
(2, 29, 0, 'hector', '2do 2da', 'Mañana', '2025-10-28', '12:18:49', '11:30:00', 'Devuelto'),
(3, 105, 0, 'sara', '2do', 'Mañana', '2025-10-28', '13:03:00', '11:30:00', 'Devuelto'),
(4, 13, 0, 'roco', '4to', 'Tarde', '2025-10-28', '13:04:00', '16:30:00', 'Devuelto Tarde'),
(5, 39, 0, 'rocho', '5to', 'Vespertino', '2025-10-29', '22:05:00', '18:00:00', 'Devuelto'),
(6, 65, 0, 'chucha', '7mo', 'Vespertino', '2025-10-29', '22:30:00', '18:00:00', 'Devuelto Tarde'),
(7, 41, 3, 'Cacho', '4to', 'Mañana', '2025-10-30', '09:55:00', '11:30:00', 'Pendiente'),
(8, 2, 1, 'sharon', '4to', 'Vespertino', '2025-10-31', '19:21:00', '18:00:00', 'Pendiente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`id_devolucion`),
  ADD KEY `fk_devoluciones_prestamos` (`id_prestamo`);

--
-- Indices de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  ADD PRIMARY KEY (`id_herramienta`);

--
-- Indices de la tabla `herramientasrotas`
--
ALTER TABLE `herramientasrotas`
  ADD PRIMARY KEY (`id_hrotas`),
  ADD KEY `fk_herramientasrotas_herramientas` (`id_herramienta`);


--
-- Indices de la tabla `nodevuelto`
--
ALTER TABLE `nodevuelto`
  ADD PRIMARY KEY (`id_nodevuelto`),
  ADD KEY `fk_nodevuelto_prestamos` (`id_prestamo`),
  ADD KEY `fk_nodevuelto_herramientas` (`id_herramienta`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id_prestamo`),
  ADD KEY `fk_prestamos_herramientas` (`id_herramienta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `id_devolucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `herramientas`
--
ALTER TABLE `herramientas`
  MODIFY `id_herramienta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=231;

--
-- AUTO_INCREMENT de la tabla `herramientasrotas`
--
ALTER TABLE `herramientasrotas`
  MODIFY `id_hrotas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `nodevuelto`
--
ALTER TABLE `nodevuelto`
  MODIFY `id_nodevuelto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id_prestamo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `fk_devoluciones_prestamos` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`);

--
-- Filtros para la tabla `herramientasrotas`
--
ALTER TABLE `herramientasrotas`
  ADD CONSTRAINT `fk_herramientasrotas_herramientas` FOREIGN KEY (`id_herramienta`) REFERENCES `herramientas` (`id_herramienta`);

--
-- Filtros para la tabla `nodevuelto`
--
ALTER TABLE `nodevuelto`
  ADD CONSTRAINT `fk_nodevuelto_herramientas` FOREIGN KEY (`id_herramienta`) REFERENCES `herramientas` (`id_herramienta`),
  ADD CONSTRAINT `fk_nodevuelto_prestamos` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `fk_prestamos_herramientas` FOREIGN KEY (`id_herramienta`) REFERENCES `herramientas` (`id_herramienta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
