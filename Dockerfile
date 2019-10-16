# PHASE 1
FROM node:alpine as builder
WORKDIR '/app'
COPY client/package.json .
RUN npm install
COPY ./client/ .
RUN npm run build


# # PHASE 2
FROM continuumio/anaconda3
WORKDIR '/app'
# COPY --from=builder /app/build /app
EXPOSE 80

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV PATH /opt/conda/bin:$PATH

RUN conda create -n myapp nodejs
RUN echo "source activate myapp" > ~/.bashrc
ENV PATH /opt/conda/envs/myapp/bin:$PATH

COPY . .
RUN npm install
COPY --from=builder /app/build /app/client/build
RUN mkdir -p /app/tmp/my-uploads
RUN mkdir -p /app/tmp/output
RUN conda install keras
RUN conda install tensorflow
RUN conda install -c conda-forge xgboost

WORKDIR '/app'
CMD ["npm","run","start-prod"]

