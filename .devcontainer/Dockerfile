FROM node:10
RUN apt-get update
RUN apt-get install -y zsh
RUN apt-get install openssh-client
RUN yarn global add eslint
RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
COPY gitkey /root/.ssh/gitkey
RUN chmod 400 /root/.ssh/gitkey
RUN eval `ssh-agent -s` && ssh-add /root/.ssh/gitkey
RUN ssh-keyscan github.com > /root/.ssh/known_hosts
CMD ["zsh"]
