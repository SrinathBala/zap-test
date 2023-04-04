import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class DockerTestStack extends cdk.Stack {
     constructor(scope: Construct, id: string, props?: cdk.StackProps) {
       super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'MyVPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const instance = new ec2.Instance(this, 'MyInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'devops1'
    });

    instance.addUserData(`
      sudo -i
      yum update -y
      yum install python3-pip git mysql -y
      git clone "https://github.com/SrinathBala/zap-flask.git"
      pip3 install flask
      cd zap-flask/
      python3 app.py
    `);

    // allow inbound HTTP traffic
    const httpPort = ec2.Port.tcp(80);
    instance.connections.allowFromAnyIpv4(httpPort, 'allow HTTP access');
  }
}
