import { CLIPage } from './app.po';

describe('cli App', function() {
  let page: CLIPage;

  beforeEach(() => {
    page = new CLIPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
