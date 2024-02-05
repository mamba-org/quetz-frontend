# syntax=docker/dockerfile:1.2

ARG BASE_IMAGE=debian:bookworm-slim
FROM --platform=$BUILDPLATFORM $BASE_IMAGE AS fetch
ARG VERSION=1.5.3

RUN rm -f /etc/apt/apt.conf.d/docker-*
RUN --mount=type=cache,target=/var/cache/apt,id=apt-deb12 apt-get update && apt-get install -y --no-install-recommends bzip2 ca-certificates curl

RUN if [ "$BUILDPLATFORM" = 'linux/arm64' ]; then \
    export ARCH='aarch64'; \
  else \
    export ARCH='64'; \
  fi; \
  curl -L "https://micro.mamba.pm/api/micromamba/linux-${ARCH}/${VERSION}" | \
  tar -xj -C "/tmp" "bin/micromamba"


FROM --platform=$BUILDPLATFORM $BASE_IMAGE as micromamba

ARG MAMBA_ROOT_PREFIX="/opt/conda"
ARG MAMBA_EXE="/bin/micromamba"

ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV MAMBA_ROOT_PREFIX=$MAMBA_ROOT_PREFIX
ENV MAMBA_EXE=$MAMBA_EXE
ENV PATH="${PATH}:${MAMBA_ROOT_PREFIX}/bin"

COPY --from=fetch /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=fetch /tmp/bin/micromamba "$MAMBA_EXE"

ARG MAMBA_USER=jovian
ARG MAMBA_USER_ID=1000
ARG MAMBA_USER_GID=1000

ENV MAMBA_USER=$MAMBA_USER
ENV MAMBA_USER_ID=$MAMBA_USER_ID
ENV MAMBA_USER_GID=$MAMBA_USER_GID

RUN groupadd -g "${MAMBA_USER_GID}" "${MAMBA_USER}" && \
    useradd -m -u "${MAMBA_USER_ID}" -g "${MAMBA_USER_GID}" -s /bin/bash "${MAMBA_USER}"
RUN mkdir -p "${MAMBA_ROOT_PREFIX}/environments" && \
    chown "${MAMBA_USER}:${MAMBA_USER}" "${MAMBA_ROOT_PREFIX}"

ARG CONTAINER_WORKSPACE_FOLDER=/workspace
RUN mkdir -p "${CONTAINER_WORKSPACE_FOLDER}"
WORKDIR "${CONTAINER_WORKSPACE_FOLDER}"

USER $MAMBA_USER
RUN micromamba shell init --shell bash --prefix=$MAMBA_ROOT_PREFIX
SHELL ["/bin/bash", "--rcfile", "/$MAMBA_USER/.bashrc", "-c"]


FROM micromamba AS core

COPY --chown=$MAMBA_USER:$MAMBA_USER environment.yml /opt/conda/environments/environment.yml
RUN --mount=type=cache,target=$MAMBA_ROOT_PREFIX/pkgs,id=mamba-pkgs micromamba install -y --override-channels -c conda-forge -n base -f /opt/conda/environments/environment.yml


FROM core as core-devel

USER root
COPY --chown=$MAMBA_USER:$MAMBA_USER .devcontainer/apt-devel.txt /opt/conda/environments/apt-devel.txt
RUN --mount=type=cache,target=/var/cache/apt,id=apt-deb12 apt-get update && xargs apt-get install -y < /opt/conda/environments/apt-devel.txt

RUN usermod -aG sudo $MAMBA_USER
RUN echo "$MAMBA_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

COPY .devcontainer/fix-permissions.sh /bin/fix-permissions.sh
RUN chmod +x /bin/fix-permissions.sh && \
    echo 'export MAMBA_USER_ID=$(id -u)' >> /home/$MAMBA_USER/.bashrc && \
    echo 'export MAMBA_USER_GID=$(id -g)' >> /home/$MAMBA_USER/.bashrc && \
    echo "/bin/fix-permissions.sh" >> /home/$MAMBA_USER/.bashrc && \
    echo "micromamba activate" >> /home/$MAMBA_USER/.bashrc

RUN mkdir -p /code && chown -R $MAMBA_USER:$MAMBA_USER /code
RUN mkdir -p /data && chown -R $MAMBA_USER:$MAMBA_USER /data

COPY .devcontainer/startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh
ENTRYPOINT ["startup.sh"]

USER $MAMBA_USER

RUN cd /code && git clone https://github.com/mamba-org/quetz.git
RUN cd /code/quetz/plugins/quetz_runexports && pip install . --no-cache
RUN cd /code/quetz/plugins/quetz_repodata_patching && pip install . --no-cache
RUN cd /code/quetz/plugins/quetz_current_repodata && pip install . --no-cache
RUN cd /code/quetz/plugins/quetz_repodata_zchunk && pip install . --no-cache
RUN cd /code/quetz/plugins/quetz_transmutation && pip install . --no-cache
RUN pip install git+https://git@github.com/regro/libcflib@master --no-deps
RUN cd /code/quetz/plugins/quetz_harvester && pip install . --no-cache --no-deps
RUN cd /code/quetz/plugins/quetz_tos && pip install . --no-cache --no-deps

COPY --chown=$MAMBA_USER:$MAMBA_USER . /code/quetz-frontend
RUN pip install -e /code/quetz-frontend
RUN quetz-frontend link-frontend --development

COPY --chown=$MAMBA_USER:$MAMBA_USER .devcontainer/config.toml /data
RUN cd /data && quetz create --create-conf /data/quetz

EXPOSE 8000