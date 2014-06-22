/**
 * @file
 *
 * ### Responsibilities
 * - unit test the AQUA lint task.
 *
 * @author Daniel Lamb <dlamb.open.source@gmail.com>
 */
/*jshint maxstatements: 100*/

describe('lintjs', function() {
  'use strict';

  var task, aqua, cfg, gulp, ERR_MSG, OK_MSG,
      rewire = require('rewire'),
      root = '../../../',
      src = root + 'src/tasks/';

  beforeEach(function() {
    // get AQUA
    aqua = rewire(root);

    ERR_MSG = 'Lint Check: ' + aqua.colors.yellow('Lint errors found');
    OK_MSG = 'Lint Check: ' + aqua.colors.green('No errors found');

    // set task under test
    task = rewire(src + 'lintjs');

    // set aqua config to nothing
    aqua.config({});

    // mock project config
    cfg = {
      id: 'TEST'
    };

    // mock gulp
    gulp = mockGulp();

    // add spies
    spyOn(aqua, 'log');
    spyOn(aqua, 'error');
    spyOn(aqua, 'warn');
  });

  it('should exist', function() {
    // arrange
    // act
    // assert
    expect(typeof task).toBe('object');
  });

  describe('run', function() {
    var jshint, reporter, mockReq;

    beforeEach(function() {
      // mock jshint
      jshint = jasmine.createSpy('jshint').andReturn('jshint');
      // mock jshint reporter instance
      reporter = {
        on: jasmine.createSpy('on').andReturn('on')
      };
      // mock jshint reporter
      jshint.reporter = function(rpt) {
        if (typeof rpt === 'string') {
          // return reporter type (aka name)
          return rpt;
        } else {
          // return mock reporter instance
          return reporter;
        }
      };
      spyOn(jshint, 'reporter').andCallThrough();

      // mock require
      mockReq = jasmine.createSpy('mockReq').andCallFake(function() { return jshint; });

      // use dependency injection to inject mock require
      task = rewire(root + 'src/tasks/lintjs');
      task.__set__('require', mockReq);
    });

    it('should load dependencies', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(mockReq).toHaveBeenCalledWith('gulp-jshint');
    });
    it('should look up all javascript', function() {
      // arrange
      cfg.alljs = 'pathtojs';
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(gulp.src).toHaveBeenCalledWith('pathtojs');
    });
    it('should lint all JavaScript against anti-patterns', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(jshint).toHaveBeenCalled();
      expect(gulp.pipe).toHaveBeenCalledWith('jshint');
    });
    it('should use a custom reporter', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(jshint.reporter).toHaveBeenCalled();
      expect(gulp.pipe).toHaveBeenCalledWith('on');
    });
    it('should use the default reporter', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(jshint.reporter.callCount).toBeGreaterThan(1);
      expect(gulp.pipe).toHaveBeenCalledWith('default');
    });
    it('should use the fail reporter', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(jshint.reporter.callCount).toBeGreaterThan(2);
      expect(gulp.pipe).toHaveBeenCalledWith('fail');
    });
    it('should listen for errors', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(gulp.on).toHaveBeenCalledWith('error', aqua.error);
    });
    it('should listen for when the task is done', function() {
      // arrange
      // act
      task.run(aqua, cfg, gulp);
      // assert
      expect(reporter.on).toHaveBeenCalledWith('end', jasmine.any(Function));
    });

    describe('when error found', function() {
      it('should log "lint errors found" to the console', function() {
        // arrange
        task.run(aqua, cfg, gulp);
        var onErr = jshint.reporter.calls[0].args[0];
        // act
        onErr();
        // assert
        expect(aqua.log).toHaveBeenCalledWith(ERR_MSG);
        expect(aqua.error).toHaveBeenCalled();
      });
      it('should log "lint errors found" to the console once', function() {
        // arrange
        task.run(aqua, cfg, gulp);
        var onErr = jshint.reporter.calls[0].args[0];
        // act
        onErr();
        onErr();
        // assert
        expect(aqua.log.callCount).toBe(1);
        expect(aqua.error).toHaveBeenCalled();
      });
      it('should not log "no errors found" to the console', function() {
        // arrange
        task.run(aqua, cfg, gulp);
        var onErr = jshint.reporter.calls[0].args[0],
            onDone = reporter.on.calls[0].args[1];
        // act
        onErr();
        onDone();
        // assert
        expect(aqua.log).not.toHaveBeenCalledWith(OK_MSG);
      });
    });

    describe('when no errors', function() {
      it('should log "no errors found" to the console', function() {
        // arrange
        task.run(aqua, cfg, gulp);
        var onDone = reporter.on.calls[0].args[1];
        // act
        onDone();
        // assert
        expect(aqua.log).toHaveBeenCalledWith(OK_MSG);
      });
    });
  });

  describe('canRun', function() {
    it('should return true if the task can run', function() {
      // arrange
      cfg.alljs = [];
      // act
      var result = task.canRun(cfg);
      // assert
      expect(result).toBe(true);
    });
    it('should return false if the project is not properly configured', function() {
      // arrange
      // act
      var result = task.canRun({});
      // assert
      expect(result).toBe(false);
    });
  });

  describe('about', function() {
    it('should return information about the task', function() {
      // arrange
      // act
      var result = task.about();
      // assert
      expect(result).toBe('`gulp {id}-lint` to validate source files against anti-patterns');
    });
  });
});
