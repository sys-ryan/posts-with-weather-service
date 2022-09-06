import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
/**
 * 게시글에 대한 수정/삭제 시 게시글에 대한 비밀번호를 확인한 후 해당 작업을 허용/거부 할 지 결정하는 Guard 입니다.
 */
export class SecretPostGuard implements CanActivate {
  constructor(
    @InjectRepository(Post) private postReposotiry: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = +request.params.id;
    const { password } = request.headers; // 패스워드는 headers.password로 제출됩니다.

    // 제출된 패스워드가 Post에 저장된 패스워드와 일치하는지 여부를 확인합니다.
    const isMatch = await this.validatePostPassword(id, password);

    return isMatch;
  }

  /**
   * 제출된 id를 가진 Post에 설정된 패스워드가 제출된 password와 일치하는지 여부를 확인합니다.
   * @param id 게시글 id
   * @param password 게시글 비밀번호
   * @returns boolean
   */
  async validatePostPassword(id: number, password: string): Promise<boolean> {
    const post = await this.postReposotiry.findOne({ where: { id } });
    return await bcrypt.compare(password, post.password);
  }
}
