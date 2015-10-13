module.exports = function (grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      meta: {
        banner:
          '/*'+
          'Copyright (c) Microsoft, Inc.  All rights reserved.\r\n' +
          'Licensed under the Apache License, Version 2.0 (the "License"); you.\r\n' +
          'may not use this file except in compliance with the License. You may.\r\n' +
          'obtain a copy of the License at.\r\n\r\n' +
          'http://www.apache.org/licenses/LICENSE-2.0.\r\n\r\n' +
          'Unless required by applicable law or agreed to in writing, software.\r\n' +
          'distributed under the License is distributed on an "AS IS" BASIS,.\r\n' +
          'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or.\r\n' +
          'implied. See the License for the specific language governing permissions.\r\n' +
          'and limitations under the License..\r\n' +
          '*/'
      },
      concat: {
        'main': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.js',
            'src/internal/trycatch.js',

            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',
            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',
            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',
            'src/dom/eventsource.js',
            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'dist/rx.dom.js'
        },
        'main-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.js',
            'src/internal/trycatch.js',

            'src/events/addeventlistenerpolyfill.js',
            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',
            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',
            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',
            'src/dom/eventsource.js',
            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'dist/rx.dom.compat.js'
        },
        'main-ajax': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.ajax.js',
            'src/internal/trycatch.js',

            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-ajax/rx.dom.ajax.js'
        },
        'main-ajax-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.compat.js',
            'src/headers/header.ajax.js',
            'src/internal/trycatch.js',

            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-ajax-compat/rx.dom.ajax.compat.js'
        },
        'main-events': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.events.js',
            'src/internal/trycatch.js',

            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-events/rx.dom.events.js'
        },
        'main-events-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.compat.js',
            'src/headers/header.events.js',
            'src/internal/trycatch.js',

            'src/events/addeventlistenerpolyfill.js',
            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-events-compat/rx.dom.events.compat.js'
        },
        'main-html': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.html.js',
            'src/internal/trycatch.js',

            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-html/rx.dom.html.js'
        },
        'main-html-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.compat.js',
            'src/headers/header.html.js',
            'src/internal/trycatch.js',

            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-html-compat/rx.dom.html.compat.js'
        },
        'main-concurrency': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.js',
            'src/headers/header.concurrency.js',
            'src/internal/trycatch.js',

            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-concurrency/rx.dom.concurrency.js'
        },
        'main-concurrency-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.compat.js',
            'src/headers/header.concurrency.js',
            'src/internal/trycatch.js',

            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/main-concurrency-compat/rx.dom.concurrency.compat.js'
        },
        'lite': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.js',
            'src/headers/header.js',
            'src/internal/trycatch.js',

            'src/events/fromevent.js',
            'src/events/events.js',
            'src/eventsource.js',
            'src/events/ready.js',
            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',
            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',
            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite/rx.lite.dom.js'
        },
        'lite-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.compat.js',
            'src/headers/header.js',
            'src/internal/trycatch.js',

            'src/events/addeventlistenerpolyfill.js',
            'src/events/fromevent.js',
            'src/events/events.js',
            'src/eventsource.js',
            'src/events/ready.js',
            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',
            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',
            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-compat/rx.lite.dom.compat.js'
        },
        'lite-ajax': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.js',
            'src/headers/header.ajax.js',
            'src/internal/trycatch.js',

            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-ajax/rx.lite.dom.ajax.js'
        },
        'lite-ajax-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.compat.js',
            'src/headers/header.ajax.js',
            'src/internal/trycatch.js',

            'src/ajax/ajax.js',
            'src/ajax/jsonp.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-ajax-compat/rx.lite.dom.ajax.compat.js'
        },
        'lite-events': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.js',
            'src/headers/header.events.js',
            'src/internal/trycatch.js',

            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-events/rx.lite.dom.events.js'
        },
        'lite-events-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.compat.js',
            'src/headers/header.events.js',
            'src/internal/trycatch.js',

            'src/events/addeventlistenerpolyfill.js',
            'src/events/fromevent.js',
            'src/events/events.js',
            'src/events/ready.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-events-compat/rx.lite.dom.events.compat.js'
        },
        'lite-html': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.js',
            'src/headers/header.html.js',
            'src/internal/trycatch.js',

            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-html/rx.lite.dom.html.js'
        },
        'lite-html-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.compat.js',
            'src/headers/header.html.js',
            'src/internal/trycatch.js',

            'src/dom/websocket.js',
            'src/dom/worker.js',
            'src/dom/mutationobserver.js',
            'src/dom/geolocation.js',
            'src/dom/fromreader.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-html-compat/rx.lite.dom.html.compat.js'
        },
        'lite-concurrency': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.js',
            'src/headers/header.concurrency.js',
            'src/internal/trycatch.js',

            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-concurrency/rx.lite.dom.concurrency.js'
        },
        'lite-concurrency-compat': {
          src: [
            'src/headers/license.js',
            'src/headers/intro.lite.compat.js',
            'src/headers/header.concurrency.js',
            'src/internal/trycatch.js',

            'src/concurrency/requestanimationframescheduler.js',
            'src/concurrency/microtaskscheduler.js',

            'src/headers/outro.js'
          ],
          dest: 'modules/lite-concurrency-compat/rx.lite.dom.concurrency.compat.js'
        }
      },
      uglify: {
        options: {
          banner:
          '/* Copyright (c) Microsoft, Inc. All rights reserved. See License.txt in the project root for license information.*/'
        },
        'main': {
          options: {
            sourceMap: true,
            sourceMapName: 'dist/rx.dom.map'
          },
          files: {'dist/rx.dom.min.js': ['dist/rx.dom.js'] }
        },
        'main-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'dist/rx.dom.compat.map'
          },
          files: {'dist/rx.dom.compat.min.js': ['dist/rx.dom.compat.js'] }
        },
        'main-ajax': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-ajax/rx.dom.ajax.map'
          },
          files: {'modules/main-ajax/rx.dom.ajax.min.js': ['modules/main-ajax/rx.dom.ajax.js'] }
        },
        'main-ajax-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-ajax/rx.dom.ajax.compat.map'
          },
          files: {'modules/main-ajax-compat/rx.dom.ajax.compat.min.js': ['modules/main-ajax-compat/rx.dom.ajax.compat.js'] }
        },
        'main-events': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-events/rx.dom.events.map'
          },
          files: {'modules/main-events/rx.dom.events.min.js': ['modules/main-events/rx.dom.events.js'] }
        },
        'main-events-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-events-compat/rx.dom.events.compat.map'
          },
          files: {'modules/main-events-compat/rx.dom.events.compat.min.js': ['modules/main-events-compat/rx.dom.events.compat.js'] }
        },
        'main-html': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-html/rx.dom.html.map'
          },
          files: {'modules/main-html/rx.dom.html.min.js': ['modules/main-html/rx.dom.html.js'] }
        },
        'main-html-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-html-compat/rx.dom.html.compat.map'
          },
          files: {'modules/main-html-compat/rx.dom.html.compat.min.js': ['modules/main-html-compat/rx.dom.html.compat.js'] }
        },
        'main-concurrency': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-concurrency/rx.dom.concurrency.map'
          },
          files: {'modules/main-concurrency/rx.dom.concurrency.min.js': ['modules/main-concurrency/rx.dom.concurrency.js'] }
        },
        'main-concurrency-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/main-concurrency-compat/rx.dom.concurrency.compat.map'
          },
          files: {'modules/main-concurrency-compat/rx.dom.concurrency.compat.min.js': ['modules/main-concurrency-compat/rx.dom.concurrency.compat.js'] }
        },
        'lite': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite/rx.lite.dom.map'
          },
          files: {'modules/lite/rx.lite.dom.min.js': ['modules/lite/rx.lite.dom.js'] }
        },
        'lite-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-compat/rx.lite.dom.compat.map'
          },
          files: {'modules/lite-compat/rx.lite.dom.compat.min.js': ['modules/lite-compat/rx.lite.dom.compat.js'] }
        },
        'lite-ajax': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-ajax/rx.lite.dom.ajax.map'
          },
          files: {'modules/lite-ajax/rx.lite.dom.ajax.min.js': ['modules/lite-ajax/rx.lite.dom.ajax.js'] }
        },
        'lite-ajax-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-ajax-compat/rx.lite.dom.ajax.compat.map'
          },
          files: {'modules/lite-ajax-compat/rx.lite.dom.ajax.compat.min.js': ['modules/lite-ajax-compat/rx.lite.dom.ajax.compat.js'] }
        },
        'lite-events': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-events/rx.lite.dom.events.map'
          },
          files: {'modules/lite-events/rx.lite.dom.events.min.js': ['modules/lite-events/rx.lite.dom.events.js'] }
        },
        'lite-events-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-events-compat/rx.lite.dom.events.compat.map'
          },
          files: {'modules/lite-events-compat/rx.lite.dom.events.compat.min.js': ['modules/lite-events-compat/rx.lite.dom.events.compat.js'] }
        },
        'lite-html': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-html/rx.lite.dom.html.map'
          },
          files: {'modules/lite-html/rx.lite.dom.html.min.js': ['modules/lite-html/rx.lite.dom.html.js'] }
        },
        'lite-html-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-html-compat/rx.dom.html.compat.map'
          },
          files: {'modules/lite-html-compat/rx.lite.dom.html.compat.min.js': ['modules/lite-html-compat/rx.lite.dom.html.compat.js'] }
        },
        'lite-concurrency': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-concurrency/rx.lite.dom.concurrency.map'
          },
          files: {'modules/lite-concurrency/rx.lite.dom.concurrency.min.js': ['modules/lite-concurrency/rx.lite.dom.concurrency.js'] }
        },
        'lite-concurrency-compat': {
          options: {
            sourceMap: true,
            sourceMapName: 'modules/lite-concurrency-compat/rx.lite.dom.concurrency.compat.map'
          },
          files: {'modules/lite-concurrency-compat/rx.lite.dom.concurrency.compat.min.js': ['modules/lite-concurrency-compat/rx.lite.dom.concurrency.compat.js'] }
        },
      },
      qunit: {
        all: ['tests/*.html']
      }
  });

  // Load all 'grunt-*' tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('nuget', 'Register NuGet-RxJSDOM', function () {
    var done = this.async();

    //invoke nuget.exe
    grunt.util.spawn({
      cmd: '.nuget/nuget.exe',
      args: [
        //specify the .nuspec file
        'pack',
        'nuget/RxJS-Bridges-HTML/RxJS-Bridges-HTML.nuspec',

        //specify where we want the package to be created
        '-OutputDirectory',
        'nuget',

        //override the version with whatever is currently defined in package.json
        '-Version',
        grunt.config.get('pkg').version
      ]
    }, function (error, result) {
      if (error) {
        grunt.log.error(error);
      } else {
        grunt.log.write(result);
      }

      done();
    });
  });

  // Default task(s).
  grunt.registerTask('default', [
    'concat:main',
    'concat:main-compat',
    'concat:main-ajax',
    'concat:main-events',
    'concat:main-html',
    'concat:main-concurrency',

    'concat:lite',
    'concat:lite-compat',
    'concat:lite-ajax',
    'concat:lite-ajax-compat',
    'concat:lite-events',
    'concat:lite-events-compat',
    'concat:lite-html',
    'concat:lite-concurrency',

    'uglify:main',
    'uglify:main-compat',
    'uglify:main-ajax',
    'uglify:main-events',
    'uglify:main-html',
    'uglify:main-concurrency',

    'uglify:lite',
    'uglify:lite-compat',
    'uglify:lite-ajax',
    'uglify:lite-ajax-compat',
    'uglify:lite-events',
    'uglify:lite-events-compat',
    'uglify:lite-html',
    'uglify:lite-concurrency',

    'qunit'
  ]);
};
