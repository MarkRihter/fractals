/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("yandex dev environment") {    
        docker {
        	build {
            	context = "docker"
            	args["YANDEX_CLOUD_KEY_ID"] = "YANDEX_CLOUD_KEY_ID_EXAMPLE"
            	args["YANDEX_CLOUD_SECRET"] = "YANDEX_CLOUD_SECRET_EXAMPLE"
        	}
    }
}
