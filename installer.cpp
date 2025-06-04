#include <iostream>
#include <cstdlib>
#include <string>

using namespace std;

int main() {
    string installPath;
    string defaultPath = "/home/$USER/Documents";

    // Solicită utilizatorului calea de instalare
    cout << "Introduceți calea de instalare (sau apăsați Enter pentru implicit: " << defaultPath << "): ";
    getline(cin, installPath);

    if (installPath.empty()) {
        installPath = defaultPath;
    }

    // Determină directorul curent
    string currentDir = "$(pwd)";

    // Verifică dacă există folderul "interface"
    string interfacePath = currentDir + "/interface";
    
    // Instalează Nginx
    cout << "Instalarea celei mai recente versiuni de Nginx...\n";
    system("sudo apt update && sudo apt install -y nginx");

    // Mută fișierele din "interface" în directorul de instalare
    cout << "Copierea fișierelor din interface către " << installPath << "...\n";
    string copyCmd = "cp -r " + interfacePath + " " + installPath;
    system(copyCmd.c_str());

    // Creează folderul gol "storage" în directorul de instalare
    cout << "Crearea folderului gol 'storage' în " << installPath << "...\n";
    string createStorageCmd = "mkdir -p " + installPath + "/storage";
    system(createStorageCmd.c_str());

    // Configurează Nginx să folosească noul folder ca root pentru site
    cout << "Configurarea Nginx pentru a servi site-ul...\n";
    string configCmd = "echo 'server { listen 80; root " + installPath + "/interface; index index.html; }' | sudo tee /etc/nginx/sites-available/custom_site";
    system(configCmd.c_str());

    system("sudo ln -s /etc/nginx/sites-available/custom_site /etc/nginx/sites-enabled/");
    system("sudo systemctl restart nginx");

    // Instalează Node.js și npm
    cout << "Instalarea celei mai recente versiuni de Node.js și npm...\n";
    system("sudo apt install -y nodejs npm");

    // Instalează ssh2 pentru Node.js
    cout << "Instalarea bibliotecii ssh2 pentru Node.js...\n";
    system("npm install ssh2");

    // Verifică instalarea Node.js, npm și ssh2
    cout << "Verificare versiuni instalate:\n";
    system("node -v");
    system("npm -v");
    system("npm list ssh2");

    cout << "Instalarea și configurarea au fost finalizate!\n";
    return 0;
}