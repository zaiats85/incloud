- git clone project
- npm install 
- npm run dev // start node server
- npm start // react
- make sure mongod is running: service mongod status
- if not launch mongodb service with : sudo service mongodb start


- server page for adding tasks : http://localhost:8888/add-task
- server pagination for tasks: http://localhost:8888/tasks/1

Mongo :
- outPut: mongoexport --db <database-name> --collection <collection-name> --out tasks.json
- import: mongoimport --db <database-name> --collection <collection-name> --file tasks.json
