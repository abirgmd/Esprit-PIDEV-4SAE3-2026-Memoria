Vagrant.configure("2") do |config|
  # Box Selection
  config.vm.box = "ubuntu/jammy64"
  
  # Timeout and Network
  config.vm.boot_timeout = 600
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true # Jenkins
  config.vm.network "forwarded_port", guest: 9000, host: 9000, auto_correct: true # SonarQube
  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true # Grafana

  # VirtualBox Provider Settings
  config.vm.provider "virtualbox" do |vb|
    vb.name = "MemorIA-DevOps-Server"
    vb.memory = "4096" # Balanced for stability
    vb.cpus = 2
    vb.gui = true
    
    # Windows-specific network fixes
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--ioapic", "on"]
  end

  # Automated Provisioning
  config.vm.provision "shell", inline: <<-SHELL
    export DEBIAN_FRONTEND=noninteractive
    echo "🚀 Starting DevOps Environment Setup..."

    # Update System
    sudo apt-get update -y
    
    # Install Essential Tools
    sudo apt-get install -y git curl wget unzip apt-transport-https ca-certificates

    # Install Docker
    echo "--- Installing Docker ---"
    sudo apt-get install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker vagrant
    
    # Install Java 17 (Required for Jenkins)
    echo "--- Installing Java 17 ---"
    sudo apt-get install -y openjdk-17-jdk

    # Install Jenkins
    echo "--- Installing Jenkins ---"
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
      /usr/share/keyrings/jenkins-keyring.asc > /dev/null
    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
      https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
      /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y jenkins
    sudo systemctl enable jenkins
    sudo systemctl start jenkins
    sudo usermod -aG docker jenkins

    # Install Minikube
    echo "--- Installing Minikube ---"
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube

    # Install Kubectl
    echo "--- Installing Kubectl ---"
    sudo apt-get install -y kubectl

    echo "✅ Setup Complete!"
    echo "👉 Jenkins available at: http://192.168.56.10:8080"
    echo "👉 To start Minikube, run: minikube start --driver=docker"
  SHELL
end
