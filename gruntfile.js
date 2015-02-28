module.exports = function(grunt) {

  /*
  * ==========================================================================
  * Configure tasks
  * ==========================================================================
  */ 
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),
  	

    /*
    * 
    * Add ability to include partials
    * ==========================================================================
    */
    zetzer: {
      dev: {
        options: {
          env: {
            title: "Crunch Expenses Prototype",
          },
          partials: "dev/partials",
          templates: "dev/templates",
          dot_template_settings: {
            strip: false // Stops minification of html
          }
        },
        files: [
          {
            expand: true,
            cwd: "dev/",
            src: ["**/*.html", "!partials/**/*.html"],
            dest: "dist/",
            ext: ".html",

          }
        ]
      },
      build: {
        options: {
          env: {
            title: "Crunch Expenses Prototype",
          },
          partials: "dev/partials",
          templates: "dev/templates",
          dot_template_settings: {
            strip: true // Stops minification of html
          }
        },
        files: [
          {
            expand: true,
            cwd: "dev/",
            src: ["**/*.html", "!partials/**/*.html"],
            dest: "dist/",
            ext: ".html",

          }
        ]
      },
    },
    
    
    /*
    * 
    * Minifies and concatenates js files
    * ==========================================================================
    */
    uglify: {
  		dev: {
  			options: {
  				beautify: true,
  				mangle: false,
  				compress: false,
  				preserveComments: 'all'

  			},
  			src: ['dev/js/includes/**/*.js','dev/js/*.js'],
  			dest: 'dist/js/main.min.js'
  		},
      build: {
        src: ['dev/js/includes/**/*.js','dev/js/*.js'],
        dest: 'dist/js/main.min.js'
      }
  	},

    
    /*
    * 
    * Compiles scss to css (Could be swapped out for compass plugin)
    * ==========================================================================
    */ 
  	sass: {
  		dev: {
  			options: {
  				outputStyle: 'expanded'
  			},
  			files: {
  				'dist/css/main.css' : 'dev/sass/application.scss'
  			}
  		},
  		build: {
  			options: {
  				outputStyle: 'compressed'
  			},
  			files: {
  				'dist/css/main.css' : 'dev/sass/application.scss'
  			}
  		}
  	},
    
    
    /*
    * 
    * Copies required files/folders into dist
    * ==========================================================================
    */
    copy: {
      images: {
        files: [
           // flattens results to a single level 
          {expand: true, flatten: false, cwd: 'dev/img', src: ['**/*.*', '!sprites/**/*.*'], dest: 'dist/img', filter: 'isFile'},
        ],
      },
      fonts: {
        files: [
          // flattens results to a single level 
          {expand: true, flatten: false, cwd: 'dev/fonts', src: ['*.*'], dest: 'dist/fonts', filter: 'isFile'},
        ],
      },
    },
    

    /*
    * 
    * Lints js files to check for errors
    * ==========================================================================
    */
    jshint: {
      all: ['dev/**/*.js']
    },


    /*
    *
    * Compiles png in specified folder to spritesheet and produces necessary
    * css for include into main scss file
    * ==========================================================================
    */
    // sprite:{
    //   icons: {
    //     src: 'dev/img/sprites/icons/**/*.png',
    //     dest: 'dev/img/icons_sprite.png',
    //     destCss: 'dev/sass/_includes/_icons.scss',
    //     cssSpritesheetName: 'icons'
    //   },
    //   logos: {
    //     src: 'dev/img/sprites/logos/**/*.png',
    //     dest: 'dev/img/logos_sprite.png',
    //     destCss: 'dev/sass/_includes/_logos.scss',
    //     cssSpritesheetName: 'logos'
    //   },
    // },
 

    /*
    * 
    * Minifies images
    * ==========================================================================
    */
    imagemin: {                           
      dynamic: {                           
        files: [{
          expand: true,                   // Enable dynamic expansion 
          cwd: 'dist/',                   // Src matches are relative to this path 
          src: ['**/*.{png,jpg,gif}'],    // Actual patterns to match 
          dest: 'dist'                // Destination path prefix 
        }]
      }
    },


    /*
    * 
    * grunt-express will serve the files from the folders listed in `bases`
    * on specified `port` and `hostname`
    * ==========================================================================
    */
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "127.0.0.1",
          bases: "dist",
          livereload: true 
        }
      }
    },
 
    
    /*
    * 
    * grunt-open will open your browser at the project's URL
    * ==========================================================================
    */
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    },


    /*
    * 
    * Clean removes all files and folders from specified directory
    * Be sure to stop all other tasks before running this
    * ==========================================================================
    */
    clean: {
      build: {
        src: ["dist/**"],
        options: {
          force: true 
        } 
      }
    },


    /*
    * 
    * Clean removes all files and folders from specified directory
    * Be sure to stop all other tasks before running this
    * ==========================================================================
    */
    autoprefixer: {
      options: {
        // Task-specific options go here. 
      },
       // prefix the specified file 
      single_file: {
        options: {
          // Target-specific options go here. 
        },
        src: 'dist/css/main.css',
        dest: 'dist/css/main.css'
      },
    },


    /*
    * 
    * Compress files into gzips
    * 
    * ==========================================================================
    */
    compress: {
      main: {
        
        expand: true,
        cwd: 'dist/',
        src: ['**/*', '!img/**/*'],
        dest: 'dist/',
        options: {
          mode: 'deflate'
        }
      }
    },


    /*
    * 
    * Main watch task for development
    * ==========================================================================
    */
    watch : {
      options: {
        reload: true, 
      }, 
      html: {
        files: ['dev/**/*.html'],
        tasks: ['zetzer:dev'],
        options: {
          livereload: true
        }    
      },
      // jshint: {
      //   files: ['gruntfile.js','dev/js/*.js'],
      //   tasks: ['jshint'],
      //   options: {
      //     livereload: true
      //   }
      // },
      font: {
        files: ['dev/fonts/*.*'],
        tasks: ['copy:fonts']
      },
      images: {
        files: ['dev/img/**/*.*', '!dev/img/sprites/**/*.*'],
        tasks: ['copy:images']
      },
      js: {
        files: ['dev/js/*.js'],
        tasks: ['uglify:dev'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['dev/sass/**/*.scss'],
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      },
      dist: {
        files: ['dist/**/*'],
        options: {
          livereload: true
        }
      },
    }

  });



  /*
  * ==========================================================================
  * Load Plugins
  * ==========================================================================
  */  
  grunt.loadNpmTasks('grunt-spritesmith');      // 'sprite'
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');   // 'uglify:dev or uglify:build'
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-zetzer');
  grunt.loadNpmTasks('grunt-contrib-watch');    // 'watch'
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-express');  
  grunt.loadNpmTasks('grunt-contrib-copy'); 
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-compress');
 
  
  
  /*
  * ==========================================================================
  * Register Grunt Tasks
  * ==========================================================================
  */
  // build creates production ready site
  grunt.registerTask('build', ['clean', 'zetzer:build', 'uglify:build', 'sass:build', 'autoprefixer', 'copy']);
  // build_dev creates development version of site. Unminified with comments. Excludes vendor prefixes
  grunt.registerTask('build_dev', ['zetzer:dev', 'uglify:dev', 'sass:dev', 'copy']);
  // watch keeps track of changes during devlopment
  grunt.registerTask('default', ['build_dev', 'watch']);
  
  // ATTENTION! Run watch before server for LiveReload
  grunt.registerTask('server', ['build_dev', 'express', 'open', 'express-keepalive']);
  
  
};