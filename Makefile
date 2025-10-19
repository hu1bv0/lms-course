# Makefile

# Variables
SHELL := /bin/bash
NODE_VERSION := 20
APP_NAME := front_mockproject
DOCKER_IMAGE := $(APP_NAME)
DOCKER_TAG := latest

# Colors
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

.PHONY: help install dev build test lint format clean docker-build docker-run docker-stop

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo -e "${CYAN}Usage:${NC}"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${CYAN}%-20s${NC} %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo -e "${GREEN}Installing dependencies...${NC}"
	yarn install

dev: ## Start development server
	@echo -e "${GREEN}Starting development server...${NC}"
	yarn dev

build: ## Build for production
	@echo -e "${GREEN}Building for production...${NC}"
	yarn build

test: ## Run tests
	@echo -e "${GREEN}Running tests...${NC}"
	yarn test

lint: ## Run linting
	@echo -e "${GREEN}Running linter...${NC}"
	yarn lint

format: ## Format code with Prettier
	@echo -e "${GREEN}Formatting code...${NC}"
	yarn format

clean: ## Clean build artifacts and dependencies
	@echo -e "${YELLOW}Cleaning build artifacts...${NC}"
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage
	rm -rf .yarn/cache
	rm -rf .yarn/build-state.yml
	rm -rf .yarn/install-state.gz

docker-build: ## Build Docker image
	@echo -e "${GREEN}Building Docker image...${NC}"
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker-run: ## Run Docker container
	@echo -e "${GREEN}Running Docker container...${NC}"
	docker run -p 3000:3000 $(DOCKER_IMAGE):$(DOCKER_TAG)

docker-stop: ## Stop Docker container
	@echo -e "${YELLOW}Stopping Docker container...${NC}"
	docker stop $$(docker ps -q --filter ancestor=$(DOCKER_IMAGE):$(DOCKER_TAG))
