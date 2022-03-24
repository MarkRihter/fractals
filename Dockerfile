FROM ubuntu

#WORKDIR /usr/app
# install required commands
#RUN apt update && apt install curl unzip -y

# install nodejs and yarn
#RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh \
#    && bash nodesource_setup.sh \
#    && apt install nodejs -y \
#    && npm i -g yarn

# install aws-cli
#RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
#    && unzip awscliv2.zip \
#    && ./aws/install

# build app
#COPY package.json .
#COPY yarn.lock .
#RUN yarn install
#COPY . .
#RUN yarn build

# load to yandex cloud object storage
ARG YANDEX_CLOUD_KEY_ID
ARG YANDEX_CLOUD_SECRET

RUN echo $YANDEX_CLOUD_SECRET && echo $YANDEX_CLOUD_KEY_ID

#RUN aws configure set aws_access_key_id $YANDEX_CLOUD_KEY_ID && aws configure set aws_secret_access_key $YANDEX_CLOUD_SECRET && aws configure set default.region ru-central1
#CMD aws s3 --endpoint-url=https://storage.yandexcloud.net cp --recursive ./build s3://fractal-web
