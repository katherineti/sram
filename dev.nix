
{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/23.11.tar.gz") {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.google-cloud-sdk
    pkgs.firebase-tools
  ];
}
