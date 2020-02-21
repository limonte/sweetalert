import { $, Swal, SwalWithoutAnimation } from '../../utils'

describe('getTimerLeft()', () => {
  it('should return time left', () => {
    Swal.fire({
      timer: 1000
    })
    const timerLeft = Swal.getTimerLeft()
    expect(timerLeft > 0).to.be.true
    expect(timerLeft <= 1000).to.be.true
  })

  it('should return undefined if popup does not have timer', () => {
    Swal.fire({
      timer: 1000
    })
    Swal.fire('I do not have timer, I should reset timer')
    const timerLeft = Swal.getTimerLeft()
    expect(timerLeft).to.equal(undefined)
  })
})

describe('increaseTimer()', () => {
  it('should increase timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500
    })
    expect(Swal.increaseTimer(400) > 0).to.be.true
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
    }, 700)
    setTimeout(() => {
      assert.notOk(Swal.isVisible())
      done()
    }, 1000)
  })

  it('should increase stopped timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500
    })
    const remainingTime = Swal.stopTimer()
    Swal.increaseTimer(10)
    setTimeout(() => {
      expect(Swal.getTimerLeft()).to.equal(remainingTime + 10)
      done()
    }, 100)
  })
})

it('isTimerRunning() method', (done) => {
  SwalWithoutAnimation.fire({
    timer: 200
  })
  setTimeout(() => {
    expect(Swal.isTimerRunning()).to.be.true
    Swal.stopTimer()
    expect(!Swal.isTimerRunning()).to.be.true
    done()
  }, 100)
})

describe('resumeTimer()', () => {
  it('should resume timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 100
    })
    Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      Swal.resumeTimer()
    }, 200)
    setTimeout(() => {
      assert.notOk(Swal.isVisible())
      done()
    }, 700)
  })

  it('should not fail when called twice', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500
    })
    Swal.resumeTimer()
    Swal.resumeTimer()
    Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    }, 1000)
  })
})

describe('stopTimer()', () => {
  it('should stop timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500
    })
    setTimeout(() => {
      expect(Swal.stopTimer() > 0).to.be.true
    }, 50)
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    }, 750)
  })

  it('should not fail when called twice', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500
    })
    const remainingTime = Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.stopTimer()).to.equal(remainingTime)
      done()
    }, 100)
  })
})

it('toggleTimer() method', (done) => {
  SwalWithoutAnimation.fire({
    timer: 500
  })
  Swal.toggleTimer()
  setTimeout(() => {
    expect(Swal.isVisible()).to.be.true
    Swal.toggleTimer()
  }, 700)
  setTimeout(() => {
    assert.notOk(Swal.isVisible())
    done()
  }, 2000)
})

it('getTimerProgressBar() method', () => {
  SwalWithoutAnimation.fire({
    timer: 500,
    timerProgressBar: true
  })
  expect(Swal.getTimerProgressBar()).to.equal($('.swal2-timer-progress-bar'))
})
