# Task Scheduling App

## Download Here
* Use this url to download the application
  https://i.diawi.com/xrCfMv

## Tech Stack Used
* React Native with TypeScript
* Firebase for Push Notifications
* PostgreSQL for database and Prisma as the ORM
* Node JS and Express JS for Server

## Backend Endpoints
* The Backend is build using Node JS and Express JS and the data is being stored in the PostgreSQL publicly deployed instance.

### */tasks/*      
***GET*** - Gets all the tasks from the database.

***POST*** - Creates a new task in the database

	

    {
    title:string;
    description:string;
    category:string;
    time:Datetime;
    priority:string;
    fcmToken:string;
    }

 ### /tasks/:id


***PATCH*** - Updates an existing task using its id from the parameters.

     {
    title:string;
    description:string;
    category:string;
    time:Datetime;
    priority:string;
    fcmToken:string;
    }

***DELETE*** - Deletes a task using its id from the parameters.



## Features
The app encompasses with the following features: - 
*  Users would be able to Add new tasks / Update Existing Tasks and Delete Existing Tasks
* Each task would be associated with a category and priority
* Users would be able to filter their tasks based on the category and priority
* They get notified for the tasks that are scheduled for the day.

<div> 
<img src="https://github.com/Rajkiran45/ParentChildActivity_Frontend/assets/61178521/9d87a882-5c31-4686-84b0-98024df8e3a9" alt="Add Task" width="200"  />
<img src="https://github.com/Rajkiran45/ParentChildActivity_Frontend/assets/61178521/fb214f5b-373f-406f-b8bf-492922d10d39" alt="Homepage" width="200" />
<img src="https://github.com/Rajkiran45/ParentChildActivity_Frontend/assets/61178521/4bc7689f-7663-495f-b4db-59f43bd0215d" alt="Upcomming task" width="200" />
<img src="https://github.com/Rajkiran45/ParentChildActivity_Frontend/assets/61178521/2aec51df-09e8-403e-bd09-dad29e90be66" alt="Filter Task" width="200" />
<img src="https://github.com/Rajkiran45/ParentChildActivity_Frontend/assets/61178521/4c586f96-00c8-4b46-9273-ab033d4484da" alt="Notification" width="200" />
</div>



## Implementation Guide

### Frontend

 1. Clone the repository by running the following command:- 
 

    git clone repository-link

 2. Run the following command to install the dependencies required to run the application

    npm install

 3. Once the dependencies are installed, run the following command to run the application using the virtual or physical device connected.

    npm run android

### Backend
 
 1. Clone the repository by running the following command:- 
 
    git clone repository-link

 2. Run the following command to install the dependencies required to run the application

    npm install

 3. Once the dependencies are installed, run the following command to run the server locally over the port 9000.

    npm run start:dev   
