{
  description = "alycodes-react - Personal website for Aly Raffauf";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };

        # Build the React app as a Nix package
        alycodes-react = pkgs.buildNpmPackage rec {
          pname = "alycodes-react";
          version = "1.0.0";

          src = ./.;

          npmDepsHash = "sha256-sx0D1XfvYRSSU14fAmZszIE3Fzu9D+HLzJtKEPwORT8=";

          # Don't run tests during build
          npmBuildScript = "build";

          # Install phase - copy built files to output
          installPhase = ''
            runHook preInstall
            mkdir -p $out/share/alycodes-react
            cp -r dist/* $out/share/alycodes-react/
            runHook postInstall
          '';

          meta = with pkgs.lib; {
            description = "Personal website for Aly Raffauf";
            homepage = "https://alycodes.com";
            license = licenses.mit;
            maintainers = [ ];
            platforms = platforms.all;
          };
        };

        # Nginx configuration for serving the website
        nginxConf = pkgs.writeText "nginx.conf" ''
          worker_processes 1;
          error_log /var/log/nginx/error.log warn;
          pid /tmp/nginx.pid;
          daemon off;

          events {
              worker_connections 1024;
          }

          http {
              include ${pkgs.nginx}/conf/mime.types;
              default_type application/octet-stream;
              access_log /dev/stdout;

              server {
                  listen 80;
                  root ${alycodes-react}/share/alycodes-react;
                  index index.html;

                  location / {
                      try_files $uri $uri/ /index.html;
                  }
              }
          }
        '';

        # Docker image with nginx serving the website
        dockerImage = pkgs.dockerTools.buildLayeredImage {
          name = "alycodes-react";
          tag = "latest";

          contents = [
            pkgs.nginx
            alycodes-react
          ];

          extraCommands = ''
            mkdir -p tmp etc/nginx var/log/nginx
            cp ${nginxConf} etc/nginx/nginx.conf

            # Create basic passwd file with nobody user
            echo "nobody:x:65534:65534:nobody:/:/sbin/nologin" > etc/passwd
            echo "nobody:x:65534:" > etc/group
            echo "nogroup:x:65534:" >> etc/group

            # Set permissions for log directory
            chmod 755 var/log/nginx
          '';

          config = {
            Cmd = [ "${pkgs.nginx}/bin/nginx" "-c" "/etc/nginx/nginx.conf" ];
            ExposedPorts = {
              "80/tcp" = {};
            };
          };
        };

      in
      {
        packages = {
          default = alycodes-react;
          alycodes-react = alycodes-react;
          docker = dockerImage;
        };

        # Development shell and run command
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            npm-check-updates
          ];

          shellHook = ''
            echo "🚀 alycodes-react development environment"
            echo "Run 'npm install' to install dependencies"
            echo "Run 'npm run dev' to start development server"
            echo "Run 'nix build' to build the package"
            echo "Run 'nix build .#docker' to build Docker image"
          '';
        };

        # nix run starts the development server
        apps.default = {
          type = "app";
          program = toString (pkgs.writeShellScript "alycodes-dev" ''
            set -e
            echo "🚀 Starting alycodes-react development server..."
            export PATH="${pkgs.nodejs_20}/bin:$PATH"

            # Install dependencies if node_modules doesn't exist
            if [ ! -d "node_modules" ]; then
              echo "📦 Installing dependencies..."
              npm install
            fi

            # Start development server
            exec npm start
          '');
        };

        # Additional apps
        apps.build = {
          type = "app";
          program = toString (pkgs.writeShellScript "alycodes-build" ''
            set -e
            echo "🔨 Building alycodes-react..."
            export PATH="${pkgs.nodejs_20}/bin:$PATH"
            npm install
            exec npm run build
          '');
        };

        apps.serve = {
          type = "app";
          program = toString (pkgs.writeShellScript "alycodes-serve" ''
            set -e
            echo "🌐 Serving built alycodes-react..."
            echo "Building first..."
            export PATH="${pkgs.nodejs_20}/bin:$PATH"
            npm install
            npm run build
            echo "Starting local server on http://localhost:3000..."
            exec npm run preview
          '');
        };
      }
    );
}
