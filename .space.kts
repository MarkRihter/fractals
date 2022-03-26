/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("yandex dev environment") {
    docker {
        startOn {
            gitPush {
                branchFilter {
                    +"refs/heads/develop"
                }
            }
        }

        env["YANDEX_CLOUD_KEY_ID"] = Params("yandex_cloud_key_id")
        env["YANDEX_CLOUD_SECRET"] = Secrets("yandex_cloud_secret")
        build {
            file = "Dockerfile.dev"
            args["YANDEX_CLOUD_KEY_ID"] = "${'$'}YANDEX_CLOUD_KEY_ID"
            args["YANDEX_CLOUD_SECRET"] = "${'$'}YANDEX_CLOUD_SECRET"
        }
    }

    docker {
        startOn {
            gitPush {
                branchFilter {
                    +"refs/heads/main"
                }
            }
        }

        env["YANDEX_COMPUTED_CLOUD_USER"] = Params("yandex_computed_cloud_user")
        env["YANDEX_COMPUTED_CLOUD_DESTINATION"] = Params("yandex_computed_cloud_destination")
        env["YANDEX_COMPUTED_CLOUD_PASSWORD"] = Secrets("yandex_computed_cloud_password")
        build {
            file = "Dockerfile.prod"
            args["YANDEX_COMPUTED_CLOUD_USER"] = "${'$'}YANDEX_COMPUTED_CLOUD_USER"
            args["YANDEX_COMPUTED_CLOUD_DESTINATION"] = "${'$'}YANDEX_COMPUTED_CLOUD_DESTINATION"
            args["YANDEX_COMPUTED_CLOUD_PASSWORD"] = "${'$'}YANDEX_COMPUTED_CLOUD_PASSWORD"
        }
    }
}
