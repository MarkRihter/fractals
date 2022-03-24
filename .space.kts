/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("yandex dev environment") {
    container(displayName = "Say Hello", image = "hello-world")
}
