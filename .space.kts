/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("yandex dev environment") {
//    docker {
//        env["YANDEX_CLOUD_KEY_ID"] = Params("yandex_cloud_key_id")
//        env["YANDEX_CLOUD_SECRET"] = Secrets("yandex_cloud_secret")
//
//        build {
//            args["YANDEX_CLOUD_KEY_ID"] = "${'$'}YANDEX_CLOUD_KEY_ID"
//            args["YANDEX_CLOUD_SECRET"] = "${'$'}YANDEX_CLOUD_SECRET"
//        }
//    }
        container("ubuntu") {
                shellScript {
                        content = """
                                apt update \
                                && apt install curl unzip -y \
                                && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh \
                                && bash nodesource_setup.sh \
                                && apt install nodejs -y \
                                && npm i -g yarn \
                                && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
                                && unzip awscliv2.zip \
                                && ./aws/install \
                                && yarn install \
                                && yarn build \
                                && aws configure set aws_access_key_id ${'$'}YANDEX_CLOUD_KEY_ID && aws configure set aws_secret_access_key ${'$'}YANDEX_CLOUD_SECRET && aws configure set default.region ru-central1 \
                                && aws s3 --endpoint-url=https://storage.yandexcloud.net cp --recursive ./build s3://fractal-web
                        """
                }
}
