module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['uglify:development'],
			},
			css: {
				files: 'src/css/**/*.less',
				tasks: ['less:development']
			},
		},
		uglify: {
			development: {
				options: {
					mangle: false,
				},
				files: {
					'build/compiled.js': 
					[
						'src/js/const.js',
						'src/js/util.js',
						'src/js/stats.js',
						
						//'src/js/playground.js',
						'src/js/sonantx.js',
						'src/js/input.js',
						'src/js/map.js',
						'src/js/entity.js',
						'src/js/particles.js',
						'src/js/player.js',
						'src/js/mobs.js',
						'src/js/enemy.js',
						'src/js/audio.js',
						
						'src/js/main.js',
						
						
						
						]
				},
			},
			compressed: {
				options: {
					mangle: true,
					compress: {
						//TODO: Optimize using compressor options (https://github.com/mishoo/UglifyJS2#compressor-options)
						dead_code: true,
						drop_debugger: true,
						sequences: true,
						properties: true,
						evaluate: true,
						loops: true,
						unused: true
						
					}
				},
				files: {
					'build/compiled.js':
						[
						'src/js/const.js',
						'src/js/util.js',
						'src/js/stats.js',
						
						//'src/js/playground.js',
						'src/js/sonantx.js',
						'src/js/input.js',
						'src/js/map.js',
						'src/js/entity.js',
						'src/js/particles.js',
						'src/js/player.js',
						'src/js/mobs.js',
						'src/js/enemy.js',
						'src/js/audio.js',
						
						'src/js/main.js',
						
						
						
						]
				},
			}
		},
		less: {
			development: {
				files: {
					"build/style.css": "src/css/**/*.less"
				}
			},
			compressed: {
				files: {
					"src/css/**/*.css": "build/style.css"
				},
				compress: true,
			}
		},
		htmlmin: {
			development: {
				options: {
					removeComments: false,
					collapseWhitespace: false,
				},
				files: {
					'build/index.html': 'src/*.html'
				}
			},
			compressed: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: {
					'build/index.html': 'src/*.html'
				}
			}
		},
		compress: {
			main: {
				options: {
					archive: 'build/game.zip',
					mode: 'zip'
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: './',
					src: ['build/*.css', 'build/*.js', 'build/*.html'],
					dest: './'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-compress');

	var fs = require('fs');
	grunt.registerTask('sizecheck', function() {
		var done = this.async();
		fs.stat('build/game.zip', function(err, zip) {
			if (zip.size > 13312) {
				//If size in bytes greater than 13kb
				grunt.log.error("Zipped file greater than 13kb \x07 \n");
				grunt.log.error("Zip is " + zip.size + " bytes when js13k max is 13,312 bytes");
			}
			done();
		});
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify:development', 'less:development', 'htmlmin:development']);
	grunt.registerTask('build-compress', ['uglify:compressed', 'less:compressed', 'htmlmin:compressed', 'compress:main', 'sizecheck']);

};