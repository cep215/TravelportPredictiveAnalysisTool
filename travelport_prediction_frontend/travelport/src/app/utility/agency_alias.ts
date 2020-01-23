
export class AgencyAlias {
  public static CODES: string[] = [
    'b0f42a4936de8711d1f8fc6e4ae1e2bd',
    'e48f7f396eb9579d0ccf99e371ff07fc',
    'bc40d7a5caba0856f2cf7ab81e80ed00',
    'e9245f6e8025c3d6a53072076e18ce3d',
    '8e1ac3c7980a1c32d679b4d88f557cba',
    '8e9c216869345581aa89ca8f671bfeb0',
  ];

  private static CHAR_A_VALUE = 'A'.charCodeAt(0);

  public static isValidAlias(alias: string): boolean {
    let index = alias.charCodeAt(0) - this.CHAR_A_VALUE;
    return alias.length == 1 && index < AgencyAlias.CODES.length && index >= 0;
  }

  public static getCode(alias: string): string {
    return AgencyAlias.CODES[alias.charCodeAt(0) - this.CHAR_A_VALUE];
  }


}
