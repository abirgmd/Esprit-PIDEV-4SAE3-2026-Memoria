Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.network "private_network", ip: "192.168.56.10"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "8192"
    vb.cpus = 4
  end

  config.vm.provision "shell", inline: <<-SHELL
    echo "🚀 Starting DevOps Environment Setup..."

    # Update system
    sudo apt update -y && sudo apt upgrade -y

    # Install basic tools
    sudo apt install -y git curl wget unzip

    # Install Docker
    sudo apt install -y docker.io
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker vagrant

    # Install Java + Maven
    sudo apt install -y openjdk-17-jdk maven

    # Install Jenkins
    curl -fsSL https://pkg.jenkins.io/debian/jenkins.io.key | sudo tee \
      /usr/share/keyrings/jenkins-keyring.asc > /dev/null

    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
      https://pkg.jenkins.io/debian binary/ | sudo tee \
      /etc/apt/sources.list.d/jenkins.list > /dev/null

    sudo apt update
    sudo apt install -y jenkins

    sudo systemctl enable jenkins
    sudo systemctl start jenkins

    # Allow Jenkins to use Docker
    sudo usermod -aG docker jenkins

    # Install kubectl
    sudo apt install -y kubectl

    # Install Minikube
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube

    # Start Minikube (Docker driver)
    minikube start --driver=docker

    echo "✅ Installation Complete!"
    echo "👉 Jenkins: http://192.168.56.10:8080"
    echo "👉 Get password: sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
  SHELL
end
