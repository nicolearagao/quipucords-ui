import React from 'react';
import { ScanDownload } from '../scanDownload';
import { apiTypes } from '../../../constants/apiConstants';

describe('ScanDownload Component', () => {
  it('should render a basic component', async () => {
    const props = {
      job: {
        [apiTypes.API_RESPONSE_JOB_ID]: 1,
        [apiTypes.API_RESPONSE_JOB_NAME]: 'lorem ipsum'
      }
    };

    const component = await shallowHookComponent(<ScanDownload {...props} />);
    expect(component.render()).toMatchSnapshot('basic');
  });

  it('should handle custom children', async () => {
    const props = {
      job: {
        [apiTypes.API_RESPONSE_JOB_ID]: 1,
        [apiTypes.API_RESPONSE_JOB_NAME]: 'lorem ipsum'
      }
    };

    const component = await shallowHookComponent(<ScanDownload {...props}>lorem ipsum</ScanDownload>);
    expect(component.render()).toMatchSnapshot('custom');
  });

  it('should have an optional tooltip', async () => {
    const props = {
      job: {
        [apiTypes.API_RESPONSE_JOB_ID]: 1,
        [apiTypes.API_RESPONSE_JOB_NAME]: 'lorem ipsum'
      },
      tooltip: 'Lorem ipsum dolor sit'
    };

    const component = await shallowHookComponent(<ScanDownload {...props} />);
    expect(component).toMatchSnapshot('tooltip');
  });
});
