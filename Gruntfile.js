module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'data/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jsbeautifier: {
            files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'data/*.js']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('default', ['jsbeautifier', 'jshint']);
};
