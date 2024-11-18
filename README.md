
# Interactive Wedding Invitation Platform

## Overview
This project is a responsive and interactive wedding invitation website built using **HTML**, **CSS**, **JavaScript**, and **Python**. It includes a system for automatically registering RSVP responses as GitHub Issues, categorizing them for better organization, and automating daily data collection for updates and notifications.

## Features
- **Responsive Design**: The website adapts to various screen sizes, ensuring an optimal user experience across devices.
- **RSVP Automation**: Guest RSVP responses are automatically submitted as GitHub Issues. Each response is categorized using tags for efficient management.
- **Daily Data Collection**: A Python script collects data from GitHub Issues daily, processes the responses, and uploads the data to Google Sheets.
- **Stakeholder Notifications**: The system sends notifications to stakeholders when new RSVP responses are registered or updates are made.

## Skills
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python for data automation and GitHub API integration
- **Data Organization**: GitHub Issues for managing RSVP responses
- **Automation**: Python scripts for daily data collection and updates

## How It Works
1. Guests submit their RSVP through the website.
2. Each RSVP response is automatically registered as a GitHub Issue, with tags used for categorization (e.g., attending, not attending, etc.).
3. A Python script runs daily to scrape RSVP data from GitHub Issues, organizing and uploading the information to a Google Sheet.
4. Notifications are sent to stakeholders to ensure updates are communicated promptly.

## Setup Instructions
1. Clone this repository.
2. Set up GitHub API credentials for accessing Issues and automating RSVP management.
3. Configure the Python script to scrape data daily and upload it to Google Sheets.
