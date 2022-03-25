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
            args["YANDEX_CLOUD_KEY_ID"] = "${'$'}YANDEX_CLOUD_KEY_ID"
            args["YANDEX_CLOUD_SECRET"] = "${'$'}YANDEX_CLOUD_SECRET"
        }
    }
}
