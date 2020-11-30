FROM node

RUN npm install -g serve

WORKDIR /src

COPY . .

RUN npm install

RUN npm run build

WORKDIR /

COPY encryption encryption

RUN mv /src/build /app

#RUN rm -rf /src

#CMD [ "serve", "-s", "build", "-l" ]
#CMD serve -s app -l 3000
