# Skylink

Register static services with [skydns](https://github.com/skynetservices/skydns) / [skydock](https://github.com/crosbymichael/skydock).
	
Skydock is a great tool for doing DNS service discovery of your docker containers. But, it is sometimes quite handy to be able to register non-container servies into your skydns. Skylink helps you do that.

## Run

Skylink is built for use with skydock, and assumes you are running skydns as a container. The simplest register you can do is pass a *name*, *environment* and a *host*.

	docker run -link skydns:skydns asbjornenge/skylink --name rds --environment test --host 192.168.1.2

That will result in the service being registered under ***rds.test.domain***. The *domain* part is handled by skydns.

	$> dig rds.test.domain +short
	192.168.1.2

## Arguments

Skydns ses the following format for it's registry:

	<uuid>.<host>.<region>.<version>.<service>.<environment>.domain

All of these can be passed to skylink. Including some additional parameters.

	--environment <environment> | required
	--name        <service>     | required
	--version     <version>
	--region      <region>
	--host        <host>        | required
	--uuid        <uuid>
	// Additional
	--ttl         <ttl>         | default -> 10 | Time to live
	--port        <port>        | default -> 80 | SRV record port
	--skydns      <ip:port>     |               | Skydns ip and port

## Build

Skylink is actually a binary javascript application built using [nexe](https://github.com/crcn/nexe). See also [Tiny Node Containers](http://www.asbjornenge.com/wwc/tiny_node_containers.html) for some additional information about why.

If you want to build skylink yourself you can either use nexe directly or use the [asbjornenge/nexe-docker](https://index.docker.io/u/asbjornenge/nexe-docker/) container.

	docker run -i -t -v $(pwd):/skylink -w /skylink asbjornenge/nexe-docker -i index.js -o skylink

Or, run as a normal node app:

	$> git clone <skylink> && cd skylink
	$> npm install
	$> node index.js --name rds --environment test --host 10.2.2.31 --skydns 172.2.0.2:8080 

enjoy.