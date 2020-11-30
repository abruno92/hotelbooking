FROM node

RUN npm install -g serve

WORKDIR /src

COPY . .

RUN npm install

RUN npm run build

WORKDIR /

COPY /etc/ssl/certs/hotelbooking_cert.pem /cert/hotelbooking_cert.pem
COPY /etc/ssl/private/hotelbooking_key.pem /cert/hotelbooking_key.pem

RUN mv /src/build /app

#RUN rm -rf /src

#CMD [ "serve", "-s", "build", "-l" ]
#CMD serve -s app -l 3000
