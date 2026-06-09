CREATE TABLE `alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`matricula` varchar(50) NOT NULL,
	`turmaId` int NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alunos_id` PRIMARY KEY(`id`),
	CONSTRAINT `alunos_matricula_unique` UNIQUE(`matricula`)
);
--> statement-breakpoint
CREATE TABLE `turmas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`ano` varchar(4) NOT NULL,
	`turno` varchar(50) NOT NULL,
	`descricao` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `turmas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_turmaId_turmas_id_fk` FOREIGN KEY (`turmaId`) REFERENCES `turmas`(`id`) ON DELETE cascade ON UPDATE no action;