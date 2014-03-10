# Skylink

Register static services with [skydns](https://github.com/skynetservices/skydns).

	docker run -d asbjornenge/skylink --name rds --version rds1 --host 10.2.0.209 --environment test --port 5432 --ttl 10
	
This project sprung from my need to register static services with [skydock](https://github.com/crosbymichael/skydock).

enjoy.