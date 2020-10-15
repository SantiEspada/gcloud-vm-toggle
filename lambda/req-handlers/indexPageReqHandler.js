import { getVmInfo } from '../../lib';
import { stringifyError } from '../../util';
import { indexPage } from '../pages';

export async function indexPageReqHandler(req, res) {
  try {
    const { name, status } = await getVmInfo();

    const page = indexPage({
      data: {
        vmName: name,
        vmStatus: status,
      },
      config: {
        head: {
          title: `${name} (${status})`,
        },
      },
    });

    const pageContent = await page.render();

    res.send(pageContent);
  } catch (error) {
    res.status(500).send({
      error: stringifyError(error),
    });
  }
}
