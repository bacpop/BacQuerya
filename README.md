# BacQuerya <img src='public/logo.svg' align="right" height="139" />

![Azure Static Web Apps CI/CD](https://github.com/johnlees/bacquerya/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg?branch=main)

BacQuerya is a search engine for genomic metadata for bacterial pathogens. BacQuerya is built using React.js and is currently in beta. The gene and sequence searches on include *S. pneumoniae* genomic metadata at this time.

## Methods

The BacQuerya-processing pipeline ([https://github.com/bacpop/BacQuerya-processing](https://github.com/bacpop/BacQuerya-processing)) sources genomic metadata from several public repositories that include: NCBI GenBank, BioSample, the European Nucleotide Archive and the Sequence Read Archive. Metadata from each of these sources is extracted and combined into a JSON document, that is then indexed using Elastic cloud ([https://www.elastic.co](https://www.elastic.co)) and is searchable from the BacQuerya website.

We also conduct a number of pre-processing steps and include the outputs of these in the indexed metadata when appropriate. These include: evaluation of assembly quality, gene annotation (using population reference graphs and Pfam searches) and multiple sequence alignment (using the Partree algorithm in the MAFFT package).

The BacQuerya-API ([https://github.com/bacpop/BacQuerya-api](https://github.com/bacpop/BacQuerya-api)) is the backend server for the website, and used to conduct all index querying and additional user requests.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

