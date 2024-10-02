watch:
	git ls-files | grep '.zig$$' | entr -rc zig build run

serve:
	python -m http.server -d static -b 127.0.0.1 8000
