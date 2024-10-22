# Node
Bootcamp BE by BINAR

# Notes [BINAR] DEPLOY BACKEND USING DOCKER IN AWS EC2 AND SUPABASE DB

INSTALL DOCKER
	- https://docs.docker.com/engine/install/ubuntu/



GIT CLONE di /var/www
	sudo git clone https://github.com/erdiys/CarRentalBEExpress.git car-rental-be



PERMISSION
	sudo chmod -R 777 .

	
	
SETUP .ENV
	- include DATABASE_URL, SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

DATABASE_URL=
postgresql://postgres.fdgbptkuwocwrcbfmznm:SekarangSUdahSore@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true

DIRECT_URL=
postgresql://postgres.fdgbptkuwocwrcbfmznm:SekarangSUdahSore@aws-0-eu-central-1.pooler.supabase.com:5432/postgres

<pgbouncer> used if db using supabase



EDIT prisma/schema.prisma

datasource db {
	provider = "posgresql"
	url = env("DATABASE_URL")
	directUrl = env("DIRECT_URL")
}



CREATE Dockerfile

- Step 1: Use the official Node.js LTS image as the base image
FROM node:lts-alpine

- Step 2: Set the working directory in the container
WORKDIR /

- Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
- Step 4: Copy the rest of the application code into the container
COPY . .

- Step 5: Install the project dependencies
RUN npm install --only=production
RUN npx prisma db push
RUN npx prisma generate
RUN npm run seed

- Step 6: Expose the port on which the app will run
EXPOSE 3000

- Step 7: Define the command to run the app
CMD ["npm", "start"]



CREATE DOMAIN (www.duckdns.org)
	- add subdomain
	- change current ip to PUBLIC IP AWS INSTANCE

CREATE Caddyfile

http://car-rental-eys.duckdns.org {
        redir https://car-rental-eys.duckdns.org{uri} permanent
}

car-rental-eys.duckdns.org {
        reverse_proxy :3000
}



RUN 

sudo docker build -t node-backend .
sudo docker run -d -p 3000:3000 node-backend

sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

