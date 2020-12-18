FROM node

RUN npm install -g serve

WORKDIR /src

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

WORKDIR /

COPY encryption encryption

RUN mv /src/build /app

#RUN rm -rf /src

#CMD [ "serve", "-s", "build", "-l" ]
#CMD serve -s app -l 3000
